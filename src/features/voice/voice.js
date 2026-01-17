/* Antigravity Voice Control (JARVIS Protocol) */

class VoiceCommander {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = {
            'run agent': () => this.triggerAgent(),
            'deploy': () => this.triggerDeploy(),
            'activate anti gravity': () => this.triggerGravity(),
            'activate antigravity': () => this.triggerGravity(), // Alias
            'go to agents': () => window.location.href = '../agents/index.html',
            'go to editor': () => window.location.href = '../editor/index.html',
            'go to neural': () => window.location.href = '../neural/index.html',
        };

        this.init();
    }

    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false; // Single command mode
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                console.log("Voice Command Received:", transcript);
                this.handleCommand(transcript);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI(false);
            };

            this.recognition.onerror = (event) => {
                console.error("Voice Error:", event.error);
                this.isListening = false;
                this.updateUI(false);
            };

            // Inject UI Trigger
            this.injectUI();
        } else {
            console.warn("Voice API not supported in this browser.");
        }
    }

    injectUI() {
        const btn = document.createElement('button');
        btn.id = 'voice-trigger';
        btn.innerHTML = '🎙️';
        btn.title = 'Voice Control (Beta)';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(20, 20, 20, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        btn.onclick = () => this.toggleListening();
        document.body.appendChild(btn);
    }

    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isListening = true;
            this.updateUI(true);
        }
    }

    updateUI(active) {
        const btn = document.getElementById('voice-trigger');
        if (btn) {
            btn.style.background = active ? '#ff4081' : 'rgba(20, 20, 20, 0.8)';
            btn.style.boxShadow = active ? '0 0 15px #ff4081' : 'none';
        }
    }

    handleCommand(transcript) {
        // Simple fuzzy match
        for (const [key, action] of Object.entries(this.commands)) {
            if (transcript.includes(key)) {
                this.showToast(`Executing: "${key.toUpperCase()}"`);
                action();
                return;
            }
        }
        this.showToast(`Unknown Command: "${transcript}"`);
    }

    showToast(msg) {
        let toast = document.getElementById('voice-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'voice-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: rgba(0,0,0,0.9);
                color: #00e676;
                padding: 10px 20px;
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                z-index: 10001;
                border: 1px solid #333;
            `;
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        setTimeout(() => toast.remove(), 3000);
    }

    // Actions
    triggerAgent() {
        const btn = document.getElementById('run-agent-btn');
        if (btn) btn.click();
    }

    triggerDeploy() {
        alert("Simulating Deployment Sequence initiated by Voice Command...");
    }

    triggerGravity() {
        if (window.toggleGravity) {
            window.toggleGravity();
        } else {
            alert("Gravity Module not loaded on this page.");
        }
    }
}

// Initialize
window.VoiceCommander = new VoiceCommander();
