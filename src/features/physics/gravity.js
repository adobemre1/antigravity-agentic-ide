/* Antigravity Physics Engine (Matter.js Adapter) */
/* Requires matter.js loaded in window */

window.startGravity = function() {
    console.log("Initializing Anti-Gravity Engine...");
    
    // Check for Matter.js
    if (!window.Matter) {
        alert("Matter.js not loaded! Importing now...");
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
        script.onload = () => window.startGravity(); // Retry
        document.head.appendChild(script);
        return;
    }

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create();
    engine.world.gravity.y = 0; // Zero Gravity by default (Anti-Gravity)

    // Create renderer
    const canvas = document.createElement('canvas');
    canvas.id = 'gravity-canvas';
    canvas.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; pointer-events:none;"; // Pointer events handled by mouse constraint
    document.body.appendChild(canvas);

    const render = Render.create({
        element: document.body,
        canvas: canvas,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent' // Overlay on top of UI
        }
    });

    // Capture Elements
    const elements = document.querySelectorAll('.agent-card, .message, .node'); // Elements to "Float"
    const bodies = [];

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // Create Physics Body matching element size/pos
        const body = Bodies.rectangle(
            rect.left + rect.width / 2, 
            rect.top + rect.height / 2, 
            rect.width, 
            rect.height, 
            { 
                restitution: 0.9, // Bouncy
                frictionAir: 0.05, // Float resistance
                render: {
                    fillStyle: getComputedStyle(el).backgroundColor || '#333',
                    strokeStyle: '#00e676',
                    lineWidth: 1
                }
            }
        );
        
        bodies.push(body);
        
        // Hide original element
        el.style.visibility = 'hidden';
        // (Optional: You could use html2canvas to map the texture, but we'll use solid colors for perf)
    });

    // Walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
        Bodies.rectangle(window.innerWidth/2, -50, window.innerWidth, 100, wallOptions), // Top
        Bodies.rectangle(window.innerWidth/2, window.innerHeight+50, window.innerWidth, 100, wallOptions), // Bottom
        Bodies.rectangle(window.innerWidth+50, window.innerHeight/2, 100, window.innerHeight, wallOptions), // Right
        Bodies.rectangle(-50, window.innerHeight/2, 100, window.innerHeight, wallOptions) // Left
    ];

    Composite.add(engine.world, [...bodies, ...walls]);

    // Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    // Fix pointer events for mouse interaction
    render.canvas.style.pointerEvents = 'auto'; 

    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Run
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add random impulses to simulate "floating"
    setInterval(() => {
        bodies.forEach(body => {
            Matter.Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005
            });
        });
    }, 1000);

    console.log("Anti-Gravity Active.");
};

window.toggleGravity = function() {
    const canvas = document.getElementById('gravity-canvas');
    if (canvas) {
        // Reset (Refresh page is easiest to restore DOM state perfectly)
        location.reload(); 
    } else {
        window.startGravity();
    }
};
