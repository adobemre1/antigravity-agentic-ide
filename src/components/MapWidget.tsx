import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Project } from '../types';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import useSupercluster from 'use-supercluster';

// Fix for default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const icons: Record<string, L.DivIcon> = {};

const fetchIcon = (count: number, size: number) => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
      className: 'cluster-marker-container',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }
  return icons[count];
};

const createCustomIcon = (category?: string) => {
     let className = 'marker-pulse';
     if (category === 'culture') className += ' culture';
     if (category === 'infrastructure') className += ' infrastructure';
     if (category === 'social') className += ' social';

     return L.divIcon({
        className: 'custom-icon-container',
        html: `<div class="${className}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
     });
};

function Clusters({ projects }: { projects: Project[] }) {
  const map = useMap();
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [zoom, setZoom] = useState(13);

  // Update bounds/zoom on move
  const updateMap = useCallback(() => {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    updateMap();
    map.on('moveend', updateMap);
    return () => { map.off('moveend', updateMap); };
  }, [map, updateMap]);

  // Convert to GeoJSON
  const points = projects
    .filter(p => p.coordinates && p.coordinates.length === 2 && typeof p.coordinates[0] === 'number')
    .map(project => ({
    type: 'Feature' as const,
    properties: { cluster: false, projectId: project.id, category: project.categories[0], title: project.title, categories: project.categories },
    geometry: {
      type: 'Point' as const,
      coordinates: [project.coordinates![1], project.coordinates![0]] as [number, number] // [lng, lat]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: bounds || undefined,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(pointCount, 10 + (pointCount / points.length) * 20)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster?.getClusterExpansionZoom(cluster.id as number) ?? 20,
                    20
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true,
                  });
                },
              }}
            />
          );
        }

        const project = projects.find(p => p.id === cluster.properties.projectId);
        if (!project) return null;

        return (
          <Marker
            key={`project-${project.id}`}
            position={[latitude, longitude]}
            icon={createCustomIcon(project.categories[0])}
          >
             <Popup className="premium-popup">
              <div className="text-center p-2">
                <h3 className="font-bold text-primary mb-1 text-sm">{project.title}</h3>
                 <div className="text-[10px] text-text/70 mb-2 truncate max-w-[150px] uppercase tracking-wider">
                   {project.categories.join(' • ')}
                </div>
                <Link 
                  to={`/project/${project.id}`}
                  className="inline-block px-3 py-1 bg-primary text-white text-[10px] uppercase font-bold tracking-widest rounded hover:bg-primary/80 transition-all shadow-lg shadow-primary/30"
                >
                  Explore
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export function MapWidget({ projects }: { projects: Project[] }) {
  const position: [number, number] = [37.0000, 35.3213];

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 z-0 relative group">
       <div className="absolute inset-0 pointer-events-none z-[401] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
       
       <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
        className="z-0 bg-[#242424]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Clusters projects={projects} />
      </MapContainer>
    </div>
  );
}
