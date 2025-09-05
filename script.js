const terminalOutput = document.getElementById('terminalOutput');
const userInput = document.getElementById('userInput');
const cubeElement = document.getElementById('cube');
const modeToggle = document.getElementById('modeToggle');
const scrollbarThumb = document.getElementById('scrollbarThumb');

let currentInput = '';
let commandHistory = [];
let historyIndex = -1;
let scrollPosition = 0;
let maxScroll = 0;

const commands = {
    help: {
        execute: () => {
            return `
Available commands:
  about      - About me
  education  - My educational background
  skills     - Technical skills
  projects   - My projects
  resume     - View/download resume
  contact    - Contact information
  github     - Visit GitHub profile
  game       - Game development projects
  clear      - Clear terminal

Type any command to continue...`;
        }
    },
    about: {
        execute: () => {
            return `
Hi! I'm a passionate developer who loves creating 
interactive web experiences and exploring new technologies.

I enjoy building things that live on the internet, whether 
that be websites, applications, or anything in between.

My goal is to always build products that provide 
pixel-perfect, performant experiences.`;
        }
    },
    education: {
        execute: () => {
            return `
Education:
─────────────────────────────
• Bachelor of Computer Science
  University Name (2020-2024)
  GPA: 3.8/4.0
  
• Relevant Coursework:
  - Data Structures & Algorithms
  - Web Development
  - Database Systems
  - Machine Learning
  - Software Engineering`;
        }
    },
    edu: {
        execute: () => commands.education.execute()
    },
    skills: {
        execute: () => {
            return `
Technical Skills:
─────────────────────────────
Languages:
  • JavaScript/TypeScript
  • Python
  • Java
  • C++
  
Frontend:
  • React, Vue.js, Next.js
  • HTML5, CSS3, Sass
  • Tailwind CSS
  
Backend:
  • Node.js, Express
  • Django, Flask
  • PostgreSQL, MongoDB
  
Tools:
  • Git, Docker
  • AWS, CI/CD
  • Webpack, Vite`;
        }
    },
    projects: {
        execute: () => {
            return `
Projects:
─────────────────────────────
[1] Terminal Portfolio
    Interactive terminal-style portfolio
    Tech: HTML, CSS, JavaScript
    
[2] E-commerce Platform
    Full-stack online shopping platform
    Tech: React, Node.js, MongoDB
    
[3] Task Manager
    Real-time collaborative task management
    Tech: Vue.js, Express, Socket.io
    
[4] Weather Dashboard
    Beautiful weather forecast app
    Tech: React, OpenWeather API`;
        }
    },
    proj: {
        execute: () => commands.projects.execute()
    },
    resume: {
        execute: () => {
            return `
Resume:
─────────────────────────────
Download: resume.pdf
View online: yoursite.com/resume

Summary:
Passionate full-stack developer with 3+ years 
of experience building web applications.

Contact: your.email@example.com`;
        }
    },
    contact: {
        execute: () => {
            return `
Contact Information:
─────────────────────────────
📧 Email: your.email@example.com
💼 LinkedIn: linkedin.com/in/yourname
🐙 GitHub: github.com/yourusername
🐦 Twitter: @yourhandle
📱 Phone: +1 (555) 123-4567`;
        }
    },
    github: {
        execute: () => {
            window.open('https://github.com/yourusername', '_blank');
            return 'Opening GitHub profile...';
        }
    },
    game: {
        execute: () => {
            return `
Game Development:
─────────────────────────────
[1] Pixel Runner
    2D platformer game
    Engine: Unity
    Status: In Development
    
[2] Space Shooter
    Retro arcade game
    Tech: HTML5 Canvas, JS
    Status: Released
    
[3] Terminal Quest
    Text-based adventure
    Platform: Web Browser
    Status: Beta Testing
    
[4] Puzzle Master
    Brain training puzzles
    Platform: Mobile (React Native)
    Status: Concept Phase`;
        }
    },
    clear: {
        execute: () => {
            // Reset terminal to initial state
            terminalOutput.innerHTML = `
                <div class="command-line current">
                    <span class="prompt">Ω :: ~ >></span>
                    <span id="userInput" class="user-input"></span>
                    <span class="cursor">|</span>
                </div>`;
            
            // Reinitialize references after clearing
            const newUserInput = document.getElementById('userInput');
            if (newUserInput) {
                userInput = newUserInput;
            }
            
            // Reset scroll position and update scrollbar
            scrollPosition = 0;
            terminalOutput.scrollTop = 0;
            maxScroll = 0;
            updateScroll();
            
            // Hide scrollbar when cleared
            scrollbarThumb.style.display = 'none';
            
            return null;
        }
    }
};

function createRotatingCube() {
    let angle = 0;
    const size = 3;
    const width = 16;
    const height = 9;
    
    function render3DCube() {
        const buffer = [];
        const zBuffer = [];
        
        // Initialize buffers
        for (let i = 0; i < height; i++) {
            buffer[i] = new Array(width).fill(' ');
            zBuffer[i] = new Array(width).fill(-Infinity);
        }
        
        // Rotation angles
        const A = angle;
        const B = angle * 0.7;
        const C = angle * 0.5;
        
        // Rotation matrices
        const cosA = Math.cos(A), sinA = Math.sin(A);
        const cosB = Math.cos(B), sinB = Math.sin(B);
        const cosC = Math.cos(C), sinC = Math.sin(C);
        
        // Draw cube edges and faces
        for (let x = -size; x <= size; x += 0.2) {
            for (let y = -size; y <= size; y += 0.2) {
                for (const z of [-size, size]) {
                    // Apply rotations
                    let nx = x;
                    let ny = y * cosA - z * sinA;
                    let nz = y * sinA + z * cosA;
                    
                    let tx = nx * cosB + nz * sinB;
                    let tz = -nx * sinB + nz * cosB;
                    nx = tx;
                    nz = tz;
                    
                    tx = nx * cosC - ny * sinC;
                    let ty = nx * sinC + ny * cosC;
                    nx = tx;
                    ny = ty;
                    
                    // Project to 2D
                    const distance = 5;
                    const ooz = 1 / (distance + nz);
                    const xp = Math.floor(width / 2 + nx * ooz * 8);
                    const yp = Math.floor(height / 2 + ny * ooz * 4);
                    
                    if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
                        if (ooz > zBuffer[yp][xp]) {
                            zBuffer[yp][xp] = ooz;
                            const brightness = Math.abs(nz) / size;
                            if (brightness > 0.8) buffer[yp][xp] = '█';
                            else if (brightness > 0.6) buffer[yp][xp] = '▓';
                            else if (brightness > 0.4) buffer[yp][xp] = '▒';
                            else if (brightness > 0.2) buffer[yp][xp] = '░';
                            else buffer[yp][xp] = '·';
                        }
                    }
                }
            }
        }
        
        // Draw vertical edges
        for (let y = -size; y <= size; y += 0.2) {
            for (const x of [-size, size]) {
                for (const z of [-size, size]) {
                    let nx = x;
                    let ny = y * cosA - z * sinA;
                    let nz = y * sinA + z * cosA;
                    
                    let tx = nx * cosB + nz * sinB;
                    let tz = -nx * sinB + nz * cosB;
                    nx = tx;
                    nz = tz;
                    
                    tx = nx * cosC - ny * sinC;
                    let ty = nx * sinC + ny * cosC;
                    nx = tx;
                    ny = ty;
                    
                    const distance = 5;
                    const ooz = 1 / (distance + nz);
                    const xp = Math.floor(width / 2 + nx * ooz * 8);
                    const yp = Math.floor(height / 2 + ny * ooz * 4);
                    
                    if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
                        if (ooz > zBuffer[yp][xp]) {
                            zBuffer[yp][xp] = ooz;
                            const brightness = Math.abs(nz) / size;
                            if (brightness > 0.8) buffer[yp][xp] = '█';
                            else if (brightness > 0.6) buffer[yp][xp] = '▓';
                            else if (brightness > 0.4) buffer[yp][xp] = '▒';
                            else if (brightness > 0.2) buffer[yp][xp] = '░';
                            else buffer[yp][xp] = '·';
                        }
                    }
                }
            }
        }
        
        // Draw horizontal edges
        for (const y of [-size, size]) {
            for (let x = -size; x <= size; x += 0.2) {
                for (let z = -size; z <= size; z += 0.2) {
                    let nx = x;
                    let ny = y * cosA - z * sinA;
                    let nz = y * sinA + z * cosA;
                    
                    let tx = nx * cosB + nz * sinB;
                    let tz = -nx * sinB + nz * cosB;
                    nx = tx;
                    nz = tz;
                    
                    tx = nx * cosC - ny * sinC;
                    let ty = nx * sinC + ny * cosC;
                    nx = tx;
                    ny = ty;
                    
                    const distance = 5;
                    const ooz = 1 / (distance + nz);
                    const xp = Math.floor(width / 2 + nx * ooz * 8);
                    const yp = Math.floor(height / 2 + ny * ooz * 4);
                    
                    if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
                        if (ooz > zBuffer[yp][xp]) {
                            zBuffer[yp][xp] = ooz;
                            const brightness = Math.abs(nz) / size;
                            if (brightness > 0.8) buffer[yp][xp] = '█';
                            else if (brightness > 0.6) buffer[yp][xp] = '▓';
                            else if (brightness > 0.4) buffer[yp][xp] = '▒';
                            else if (brightness > 0.2) buffer[yp][xp] = '░';
                            else buffer[yp][xp] = '·';
                        }
                    }
                }
            }
        }
        
        // Convert buffer to string
        return buffer.map(row => row.join('')).join('\n');
    }
    
    function animate() {
        cubeElement.textContent = render3DCube();
        angle += 0.1;
    }
    
    setInterval(animate, 50);
    animate();
}

function executeCommand(cmd) {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === '') return null;
    
    if (commands[trimmedCmd]) {
        return commands[trimmedCmd].execute();
    } else {
        return `Command not found: ${trimmedCmd}
Type 'help' for available commands.`;
    }
}

function addCommandToTerminal(command, result) {
    const currentCommandLine = terminalOutput.querySelector('.command-line.current');
    if (currentCommandLine) {
        // Create new command line with the executed command
        const executedCommandLine = document.createElement('div');
        executedCommandLine.className = 'command-line';
        executedCommandLine.innerHTML = `
            <span class="prompt">Ω :: ~ >></span>
            <span class="command">${command}</span>
        `;
        
        // Replace current line with executed command line
        currentCommandLine.replaceWith(executedCommandLine);
    }
    
    // Add result if there is one
    if (result) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'command-result';
        resultDiv.innerHTML = `<pre>${result}</pre>`;
        terminalOutput.appendChild(resultDiv);
    }
    
    // Add new current command line
    const newCommandLine = document.createElement('div');
    newCommandLine.className = 'command-line current';
    newCommandLine.innerHTML = `
        <span class="prompt">Ω :: ~ >></span>
        <span id="userInput" class="user-input"></span>
        <span class="cursor">|</span>
    `;
    terminalOutput.appendChild(newCommandLine);
    
    // Update references
    const newUserInput = document.getElementById('userInput');
    if (newUserInput) {
        // Update the global reference
        window.userInput = newUserInput;
    }
    
    updateScroll();
    scrollToBottom();
}

function updateScroll() {
    const container = terminalOutput;
    const containerHeight = container.clientHeight;
    const contentHeight = container.scrollHeight;
    
    maxScroll = Math.max(0, contentHeight - containerHeight);
    
    if (maxScroll > 0) {
        const thumbHeight = Math.max(20, (containerHeight / contentHeight) * containerHeight);
        const thumbPosition = (scrollPosition / maxScroll) * (containerHeight - thumbHeight);
        
        scrollbarThumb.style.height = thumbHeight + 'px';
        scrollbarThumb.style.top = thumbPosition + 'px';
        scrollbarThumb.style.display = 'block';
    } else {
        scrollbarThumb.style.display = 'none';
    }
}

function scrollToBottom() {
    scrollPosition = maxScroll;
    terminalOutput.scrollTop = scrollPosition;
    updateScroll();
}

function handleKeyPress(e) {
    const activeUserInput = document.getElementById('userInput');
    if (!activeUserInput) return;
    
    if (e.key === 'Enter') {
        const command = currentInput;
        if (command.trim()) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            
            const result = executeCommand(command);
            addCommandToTerminal(command, result);
            
            currentInput = '';
            activeUserInput.textContent = '';
        }
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        currentInput = currentInput.slice(0, -1);
        activeUserInput.textContent = currentInput;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            currentInput = commandHistory[historyIndex];
            activeUserInput.textContent = currentInput;
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentInput = commandHistory[historyIndex];
            activeUserInput.textContent = currentInput;
        } else {
            historyIndex = commandHistory.length;
            currentInput = '';
            activeUserInput.textContent = '';
        }
    } else if (e.key.length === 1) {
        currentInput += e.key;
        activeUserInput.textContent = currentInput;
    }
}

function initializeHelpListHandlers() {
    document.querySelectorAll('.help-list li').forEach(item => {
        item.addEventListener('click', function() {
            const cmd = this.textContent;
            currentInput = cmd;
            const activeUserInput = document.getElementById('userInput');
            if (activeUserInput) {
                activeUserInput.textContent = cmd;
            }
            
            setTimeout(() => {
                const result = executeCommand(cmd);
                addCommandToTerminal(cmd, result);
                currentInput = '';
                const newActiveUserInput = document.getElementById('userInput');
                if (newActiveUserInput) {
                    newActiveUserInput.textContent = '';
                }
            }, 300);
        });
    });
}

// Scroll event handling
terminalOutput.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY;
    const scrollStep = 30;
    
    scrollPosition += delta > 0 ? scrollStep : -scrollStep;
    scrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));
    
    this.scrollTop = scrollPosition;
    updateScroll();
});

// Scrollbar dragging
let isDragging = false;
let dragStartY = 0;
let dragStartTop = 0;

scrollbarThumb.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragStartY = e.clientY;
    dragStartTop = parseInt(this.style.top) || 0;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
    e.preventDefault();
});

function onDrag(e) {
    if (!isDragging) return;
    
    const deltaY = e.clientY - dragStartY;
    const newTop = dragStartTop + deltaY;
    const containerHeight = terminalOutput.clientHeight;
    const thumbHeight = scrollbarThumb.offsetHeight;
    const maxTop = containerHeight - thumbHeight;
    
    const clampedTop = Math.max(0, Math.min(newTop, maxTop));
    const scrollRatio = clampedTop / maxTop;
    
    scrollPosition = scrollRatio * maxScroll;
    terminalOutput.scrollTop = scrollPosition;
    
    scrollbarThumb.style.top = clampedTop + 'px';
}

function onDragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDragEnd);
}

modeToggle.addEventListener('click', function() {
    alert('Terminal mode is the primary interface. Use keyboard or click on commands to interact!');
});

document.addEventListener('keydown', handleKeyPress);

createRotatingCube();

function typeWriter() {
    const text = "type help to start";
    const element = document.querySelector('.typed-text');
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

function glitchNameSwitch() {
    const nameElement = document.querySelector('.glitch-name');
    let isOriginal = true;
    
    setInterval(() => {
        // Add glitch effect
        nameElement.style.animation = 'none';
        setTimeout(() => {
            nameElement.style.animation = '';
        }, 10);
        
        // Add glitch visual effect
        nameElement.classList.add('glitching');
        
        setTimeout(() => {
            // Switch text
            if (isOriginal) {
                nameElement.textContent = 'A3silent ';
                nameElement.setAttribute('data-text', 'A3silent ');
            } else {
                nameElement.textContent = 'ritz sun ';
                nameElement.setAttribute('data-text', 'ritz sun ');
            }
            isOriginal = !isOriginal;
            
            // Remove glitch effect
            nameElement.classList.remove('glitching');
        }, 400);
    }, 5000); // Switch every 5 seconds
}

window.addEventListener('load', () => {
    typeWriter();
    glitchNameSwitch();
    updateScroll();
});