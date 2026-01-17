

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'future';
  actor?: string; // Who did it? e.g., "City Council"
}

interface ProcessTimelineProps {
  events: TimelineEvent[];
}

export function ProcessTimeline({ events }: ProcessTimelineProps) {
  return (
    <div className="relative pl-4 border-l border-border/50 ml-2 space-y-8">
      {events.map((event) => (
        <div key={event.id} className="relative">
           {/* Timeline Dot */}
           <div 
             className={`
                absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 
                ${event.status === 'completed' ? 'bg-primary border-primary' : 
                  event.status === 'current' ? 'bg-background border-primary shadow-[0_0_0_4px_rgba(0,75,145,0.2)]' : 
                  'bg-background border-border'}
             `}
           />
           
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-mono text-text/50">{new Date(event.date).toLocaleDateString()}</span>
                 {event.status === 'current' && (
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">
                        Current Stage
                    </span>
                 )}
              </div>
              
              <h4 className={`text-sm font-bold ${event.status === 'future' ? 'text-text/50' : 'text-text'}`}>
                  {event.title}
              </h4>
              
              {event.description && (
                  <p className="text-xs text-text/60 max-w-xs">{event.description}</p>
              )}
              
              {event.actor && (
                  <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-4 h-4 rounded-full bg-surface border border-border flex items-center justify-center text-[8px] text-text/50">
                          {event.actor.charAt(0)}
                      </div>
                      <span className="text-[10px] text-text/40">by {event.actor}</span>
                  </div>
              )}
           </div>
        </div>
      ))}
    </div>
  );
}
