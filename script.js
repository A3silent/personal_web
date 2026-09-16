const terminalOutput = document.getElementById('terminalOutput');
let userInput = document.getElementById('userInput');
const cubeElement = document.getElementById('cube');
const modeToggle = document.getElementById('modeToggle');
const scrollbarThumb = document.getElementById('scrollbarThumb');

let currentInput = '';
/** @type {string[]} */
let commandHistory = [];
let historyIndex = -1;
let scrollPosition = 0;
let maxScroll = 0;
let waitingForProjectsResponse = false;
/** @type {'en' | 'zh'} */
let currentLanguage = 'en';

const translations = {
    en: {
        prompt: 'type help to start',
        commands: {
            help: `
Available commands:
  about      - About me
  experience - Work experience (exp)
  education  - My educational background
  skills     - Technical skills
  projects   - My projects
  resume     - View/download resume
  contact    - Contact information
  email      - Send email
  linkedin   - Visit LinkedIn profile
  github     - Visit GitHub profile
  cn/en      - Switch language / 切换语言
  clear      - Clear terminal

Type any command to continue...`,
            langSwitch: 'Language switched to Chinese / 语言已切换到中文',
            langSwitchEng: 'Language switched to English / 语言已切换到英文',
            about: `
Hi! I'm Chengze (Ritz) Sun, a Computer Engineering student
at the University of Waterloo, based in Waterloo, Canada.

I work on gameplay, game engines, graphics, and GPU systems.
My co-op experience spans HoYoverse (miHoYo), Digital Extremes,
CoreAVI (Lynx), and Huawei Canada.

Type 'experience' to explore my work or 'projects' for personal projects.`,
            experience: `
Work Experience | Co-op:
─────────────────────────────
[1] HoYoverse (miHoYo)
    Gameplay / Engine Engineer | May 2026 - Aug 2026
    • Built gameplay telemetry for a pre-production UE5 title:
      match pacing, kill heatmaps, and ability-selection analysis.
    • Built Slate tools for UDP-based LAN lobby creation and
      discovery across editor instances, PIE, and standalone clients.
    • Added a packaged-game LAN login and dedicated lobby flow,
      reusing networking systems across editor and packaged builds.
    • Contributed automated changelist reviews and daily build
      performance analysis to agent-assisted engineering workflows.
    • Led end-to-end testing of an internal AI production platform
      for code assistance, 3D content, and animation generation.

[2] Digital Extremes
    Gameplay / Graphics Engineer | Jan 2026 - Apr 2026
    • Implemented Warframe gameplay and runtime systems in C++
      within the proprietary Evolution engine.
    • Built dialogue cameras with dynamic transitions and
      interpolation, integrated with runtime rendering updates.
    • Contributed gameplay features and system reworks to
      Warframe: The Shadowgrapher.

[3] CoreAVI (Lynx)
    Graphics Software Engineer | May 2025 - Aug 2025
    • Investigated Vulkan CTS failures and hangs, added debugging
      instrumentation, and reduced non-passing driver tests.
    • Debugged GPU crashes and validation errors involving
      synchronization, descriptors, and pipeline setup.
    • Helped build a compositor demo rendering Vulkan SC,
      OpenGL SC, and OpenGL windows simultaneously.

[4] Huawei Technologies Co., Ltd. Canada
    GPU Driver Engineer | Sept 2024 - Dec 2024
    • Evaluated rendering technologies including D3D12 work graphs
      and summarized implications for future driver design.
    • Implemented and profiled demo shaders to address bottlenecks.
    • Fixed Vulkan/OpenGL rendering issues involving command
      buffers, resource layouts, and synchronization.`,
            education: `
Education:
─────────────────────────────
• University of Waterloo | Waterloo, Ontario
  Candidate for BASc in Computer Engineering
  Sept 2023 - May 2028 (expected)

• University of California, Berkeley | California, USA
  Study in Computer Science and Astronomy
  Jun 2022 - Aug 2022`,
            skills: `
Technical Skills:
─────────────────────────────
Languages:
  C/C++, C#, Java, Python, Swift, Lua

GPU / Systems:
  UE5, CUDA, Vulkan, OpenGL, GLSL/SPIR-V
  GPU memory management, synchronization

ML / Compute:
  PyTorch, NumPy

Tools / Frameworks:
  Nsight Compute, Nsight Systems, RenderDoc
  Xcode, Linux, Git, CMake`,
            projects: `
Projects:
─────────────────────────────
[1] Silic2 - Doom-like FPS Game
    • Doom-inspired FPS with pixel-art style visuals
    • Fast-paced shooting, multiple weapons, dynamic movement
    • GPU-driven particle system for effects
    • Custom map editor with Dear ImGui
    Tech: C++, OpenGL, ImGui
    
[2] Simple Vulkan Engine  
    • Lightweight 3D renderer with multiple model loading
    • Vulkan pipeline with shaders and command buffers
    • Simple Monte Carlo Ray Tracing and Phong shading for lighting
    • Dynamic uniform buffers for transformations
    Tech: C++, Vulkan, CMake, SPIR-V
    
[3] Luminosity of Astronomical Research (UC Berkeley)
    • Star luminosity correlation analysis
    • Data visualization and analysis
    • Proficiency in data manipulation and organization
    Tech: Python, pandas, NumPy, Matplotlib, Scipy

─────────────────────────────
Would you like to see more details? (y/n)`,
            contact: `
Contact Information:
─────────────────────────────
📧 Email: A3silent@outlook.com
   (type 'email' to send an email)
   
💼 LinkedIn: linkedin.com/in/ritz-sun-511321290/
   (type 'linkedin' to open profile)
   
🐙 GitHub: github.com/A3silent
   (type 'github' to open profile)
   
📱 Phone: +1 437 360 6602
📍 Location: Waterloo, Canada`,
            resume: `
Opening resume...

Resume: docs/Ritz_Sun_Resume.pdf`,
            email: 'Opening email client...',
            linkedin: 'Opening LinkedIn profile...',
            github: 'Opening GitHub profile...',
            projectsOpen: 'Opening projects page...',
            projectsReturn: 'Returning to terminal...',
            projectsInvalid: 'Please enter y (yes) or n (no):',
            notFound: (/** @type {string} */ cmd) => `Command not found: ${cmd}
Type 'help' for available commands.`
        },
        modeButton: '中文模式'
    },
    zh: {
        prompt: '输入 help 开始',
        commands: {
            help: `
可用命令:
  about      - 关于我
  experience - 工作经历 (exp)
  education  - 教育背景
  skills     - 技术技能
  projects   - 我的项目
  resume     - 查看/下载简历
  contact    - 联系信息
  email      - 发送邮件
  linkedin   - 访问 LinkedIn 主页
  github     - 访问 GitHub 主页
  cn/en      - 切换语言 / Switch language
  clear      - 清空终端

输入任意命令继续...`,
            langSwitch: '语言已切换到中文 / Language switched to Chinese',
            langSwitchEng: '语言已切换到英文 / Language switched to English',
            about: `
你好！我是孙承泽（Chengze / Ritz Sun），滑铁卢大学计算机工程专业学生，现居加拿大滑铁卢。

我的实践领域涵盖游戏玩法、游戏引擎、图形渲染与 GPU 系统，曾在米哈游（HoYoverse）、Digital Extremes、CoreAVI（Lynx）和华为加拿大完成 Co-op 实习。

输入 'experience' 查看工作经历，或输入 'projects' 查看个人项目。`,
            experience: `
工作经历 | Co-op 实习:
─────────────────────────────
[1] 米哈游（HoYoverse）
    游戏玩法 / 引擎工程师 | 2026年5月 - 8月
    • 为预研阶段的 UE5 游戏开发对局节奏、击杀热力图及技能选择分析工具。
    • 使用 Slate 构建基于 UDP 的局域网大厅创建与发现工具，支持编辑器实例、PIE 和独立客户端。
    • 为打包版本添加局域网登录与专用大厅流程，复用编辑器与打包版本的网络系统。
    • 参与自动化代码变更审查及每日构建性能分析流程建设。
    • 推动内部 AI 生产平台的端到端测试，覆盖代码辅助、3D 内容与动画生成。

[2] Digital Extremes
    游戏玩法 / 图形工程师 | 2026年1月 - 4月
    • 在自研 Evolution 引擎中使用 C++ 开发 Warframe 玩法与运行时系统。
    • 实现支持动态切换与插值的对话摄像机，集成运行时视图与渲染更新。
    • 参与 Warframe: The Shadowgrapher 的玩法开发与多个模块的系统重构。

[3] CoreAVI（Lynx）
    图形软件工程师 | 2025年5月 - 8月
    • 排查 Vulkan CTS 失败与挂起问题，添加调试工具，减少驱动测试失败项。
    • 分析 GPU 崩溃与验证错误，定位同步、描述符使用及管线配置问题。
    • 参与图形合成器演示，同时渲染 Vulkan SC、OpenGL SC 和 OpenGL 窗口。

[4] 华为加拿大
    GPU 驱动工程师 | 2024年9月 - 12月
    • 评估 D3D12 Work Graphs 等渲染技术及其对未来驱动设计的影响。
    • 编写与优化演示着色器，使用性能分析工具定位瓶颈。
    • 调试命令缓冲区、资源布局与同步，修复 Vulkan/OpenGL 渲染问题。`,
            education: `
教育背景:
─────────────────────────────
• 滑铁卢大学 | 加拿大安大略省滑铁卢
  计算机工程应用科学学士在读（BASc）
  2023年9月 - 2028年5月（预计）

• 加州大学伯克利分校 | 美国加利福尼亚州
  计算机科学与天文学学习经历
  2022年6月 - 2022年8月`,
            skills: `
技术技能:
─────────────────────────────
编程语言:
  C/C++, C#, Java, Python, Swift, Lua

GPU / 系统:
  UE5, CUDA, Vulkan, OpenGL, GLSL/SPIR-V
  GPU 内存管理、同步

机器学习 / 计算:
  PyTorch, NumPy

工具 / 框架:
  Nsight Compute, Nsight Systems, RenderDoc
  Xcode, Linux, Git, CMake`,
            projects: `
项目:
─────────────────────────────
[1] Silic2 - 类Doom FPS游戏
    • 受Doom启发的像素艺术风格FPS
    • 快节奏射击，多种武器，动态移动
    • GPU驱动的粒子系统效果
    • 使用Dear ImGui的自定义地图编辑器
    技术栈: C++, OpenGL, ImGui
    
[2] 简单Vulkan引擎  
    • 支持多模型加载的轻量级3D渲染器
    • Vulkan管线与着色器和命令缓冲区
    • 简单蒙特卡罗光线追踪和Phong着色照明
    • 用于变换的动态统一缓冲区
    技术栈: C++, Vulkan, CMake, SPIR-V
    
[3] 天文研究光度分析 (加州大学伯克利分校)
    • 恒星光度相关性分析
    • 数据可视化和分析
    • 熟练的数据操作和组织
    技术栈: Python, pandas, NumPy, Matplotlib, Scipy

─────────────────────────────
您想查看更多详情吗? (y/n)`,
            contact: `
联系信息:
─────────────────────────────
📧 邮箱: A3silent@outlook.com
   (输入 'email' 发送邮件)
   
💼 LinkedIn: linkedin.com/in/ritz-sun-511321290/
   (输入 'linkedin' 打开主页)
   
🐙 GitHub: github.com/A3silent
   (输入 'github' 打开主页)
   
📱 电话: +1 437 360 6602
📍 所在地: 加拿大滑铁卢`,
            resume: `
打开简历中...

简历: docs/Ritz_Sun_Resume.pdf`,
            email: '打开邮件客户端...',
            linkedin: '打开 LinkedIn 主页...',
            github: '打开 GitHub 主页...',
            projectsOpen: '打开项目页面...',
            projectsReturn: '返回终端...',
            projectsInvalid: '请输入 y (是) 或 n (否):',
            notFound: (/** @type {string} */ cmd) => `未找到命令: ${cmd}
输入 'help' 查看可用命令。`
        },
        modeButton: 'English Mode'
    }
};

/**
 * @param {`commands.${keyof typeof translations.en.commands}`} key
 * @param {string} [command] Input to include in a command-not-found message.
 * @returns {string}
 */
function getTranslation(key, command = '') {
    const commandKey = /** @type {keyof typeof translations.en.commands} */ (
        key.slice('commands.'.length)
    );
    const value = translations[currentLanguage].commands[commandKey];
    return typeof value === 'function' ? value(command) : value;
}

const commands = {
    help: {
        execute: () => {
            return getTranslation('commands.help');
        }
    },
    about: {
        execute: () => {
            return getTranslation('commands.about');
        }
    },
    experience: {
        execute: () => getTranslation('commands.experience')
    },
    exp: {
        execute: () => commands.experience.execute()
    },
    education: {
        execute: () => {
            return getTranslation('commands.education');
        }
    },
    edu: {
        execute: () => commands.education.execute()
    },
    skills: {
        execute: () => {
            return getTranslation('commands.skills');
        }
    },
    projects: {
        execute: () => {
            waitingForProjectsResponse = true;
            return getTranslation('commands.projects');
        }
    },
    proj: {
        execute: () => commands.projects.execute()
    },
    resume: {
        execute: () => {
            const resumeFile = 'docs/Ritz_Sun_Resume.pdf';
            window.open(resumeFile, '_blank');
            return getTranslation('commands.resume');
        }
    },
    contact: {
        execute: () => {
            return getTranslation('commands.contact');
        }
    },
    email: {
        execute: () => {
            window.open('mailto:A3silent@outlook.com', '_blank');
            return getTranslation('commands.email');
        }
    },
    linkedin: {
        execute: () => {
            window.open('https://linkedin.com/in/ritz-sun-511321290/', '_blank');
            return getTranslation('commands.linkedin');
        }
    },
    github: {
        execute: () => {
            window.open('https://github.com/A3silent', '_blank');
            return getTranslation('commands.github');
        }
    },
    cn: {
        execute: () => {
            if (currentLanguage === 'zh') {
                return '已经是中文模式 / Already in Chinese mode';
            }
            currentLanguage = 'zh';
            
            // Update mode button text
            const modeToggle = document.getElementById('modeToggle');
            if (modeToggle) {
                modeToggle.textContent = translations[currentLanguage].modeButton;
            }
            
            // Update typed text
            const typedText = document.querySelector('.typed-text');
            if (typedText) {
                typedText.textContent = translations[currentLanguage].prompt;
            }
            
            return getTranslation('commands.langSwitch');
        }
    },
    en: {
        execute: () => {
            if (currentLanguage === 'en') {
                return 'Already in English mode / 已经是英文模式';
            }
            currentLanguage = 'en';
            
            // Update mode button text
            const modeToggle = document.getElementById('modeToggle');
            if (modeToggle) {
                modeToggle.textContent = translations[currentLanguage].modeButton;
            }
            
            // Update typed text
            const typedText = document.querySelector('.typed-text');
            if (typedText) {
                typedText.textContent = translations[currentLanguage].prompt;
            }
            
            return getTranslation('commands.langSwitchEng');
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
    
    // Handle y/n response for projects
    if (waitingForProjectsResponse) {
        waitingForProjectsResponse = false;
        if (trimmedCmd === 'y' || trimmedCmd === 'yes') {
            // Open projects subpage with current language
            window.open(`projects/projects.html?lang=${currentLanguage}`, '_blank');
            return getTranslation('commands.projectsOpen');
        } else if (trimmedCmd === 'n' || trimmedCmd === 'no') {
            return getTranslation('commands.projectsReturn');
        } else {
            waitingForProjectsResponse = true; // Keep waiting if invalid response
            return getTranslation('commands.projectsInvalid');
        }
    }
    
    if (commands[trimmedCmd]) {
        return commands[trimmedCmd].execute();
    } else {
        return getTranslation('commands.notFound', trimmedCmd);
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
        userInput = newUserInput;
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

function handleKeyDown(e) {
    const activeUserInput = document.getElementById('userInput');
    if (!activeUserInput) return;
    
    switch(e.key) {
        case 'Enter':
            e.preventDefault();
            if (currentInput.trim()) {
                commandHistory.push(currentInput);
                historyIndex = commandHistory.length;
                
                const result = executeCommand(currentInput);
                addCommandToTerminal(currentInput, result);
                
                currentInput = '';
                activeUserInput.textContent = '';
            }
            break;
            
        case 'Backspace':
            e.preventDefault();
            currentInput = currentInput.slice(0, -1);
            activeUserInput.textContent = currentInput;
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                currentInput = commandHistory[historyIndex];
                activeUserInput.textContent = currentInput;
            }
            break;
            
        case 'ArrowDown':
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
            break;
    }
}

function handleKeyPress(e) {
    const activeUserInput = document.getElementById('userInput');
    if (!activeUserInput) return;
    
    // Only handle printable characters
    if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
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
    // Toggle language
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    
    // Update button text
    this.textContent = translations[currentLanguage].modeButton;
    
    // Update typed text
    const typedText = document.querySelector('.typed-text');
    if (typedText) {
        typedText.textContent = translations[currentLanguage].prompt;
    }
});

// Debug mode - set to true to see keyboard events in console
const DEBUG_MODE = false;

// Setup keyboard event listeners
document.addEventListener('keydown', function(e) {
    if (DEBUG_MODE) console.log('keydown:', e.key, e.keyCode);
    handleKeyDown(e);
});

document.addEventListener('keypress', function(e) {
    if (DEBUG_MODE) console.log('keypress:', e.key, e.charCode);
    handleKeyPress(e);
});

// Alternative input method using a hidden input field
const hiddenInput = document.getElementById('hiddenInput');

if (hiddenInput) {
    // Keep focus on the hidden input
    function maintainFocus() {
        if (document.activeElement !== hiddenInput) {
            hiddenInput.focus();
        }
    }
    
    // Set initial focus
    hiddenInput.focus();
    
    // Maintain focus on click
    document.addEventListener('click', function(e) {
        if (e.target !== hiddenInput) {
            e.preventDefault();
            hiddenInput.focus();
        }
    });
    
    // Handle input in the hidden field
    hiddenInput.addEventListener('beforeinput', function(e) {
        const activeUserInput = document.getElementById('userInput');
        if (!activeUserInput) return;
        
        if (e.inputType === 'insertText' && e.data) {
            currentInput += e.data;
            activeUserInput.textContent = currentInput;
        } else if (e.inputType === 'deleteContentBackward') {
            currentInput = currentInput.slice(0, -1);
            activeUserInput.textContent = currentInput;
        }
    });
    
    // Handle special keys in the hidden input
    hiddenInput.addEventListener('keydown', function(e) {
        const activeUserInput = document.getElementById('userInput');
        if (!activeUserInput) return;
        
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInput.trim()) {
                commandHistory.push(currentInput);
                historyIndex = commandHistory.length;
                
                const result = executeCommand(currentInput);
                addCommandToTerminal(currentInput, result);
                
                currentInput = '';
                activeUserInput.textContent = '';
                hiddenInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                currentInput = commandHistory[historyIndex];
                activeUserInput.textContent = currentInput;
                hiddenInput.value = currentInput;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                currentInput = commandHistory[historyIndex];
                activeUserInput.textContent = currentInput;
                hiddenInput.value = currentInput;
            } else {
                historyIndex = commandHistory.length;
                currentInput = '';
                activeUserInput.textContent = '';
                hiddenInput.value = '';
            }
        }
    });
    
    // Keep input synchronized
    hiddenInput.addEventListener('input', function(e) {
        const activeUserInput = document.getElementById('userInput');
        if (activeUserInput) {
            currentInput = e.target.value;
            activeUserInput.textContent = currentInput;
        }
    });
    
    // Focus on page visibility change
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(() => hiddenInput.focus(), 100);
        }
    });
    
    // Periodic focus check
    setInterval(maintainFocus, 500);
}

createRotatingCube();

function typeWriter() {
    const text = translations[currentLanguage].prompt;
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
    
    // Ensure focus on load
    const hiddenInput = document.getElementById('hiddenInput');
    if (hiddenInput) {
        hiddenInput.focus();
        console.log('Terminal ready - start typing!');
    }
});