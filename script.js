document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    // Initial greeting displayed in the terminal
    const welcomeMessage = `
    <div class="welcome">
    <span class="prompt">λ</span> whoami<br>
    <b>Your Name</b> — Full-Stack Developer & Software Engineer based in <span class="highlight">Your Location</span>.<br><br>
    I specialize in building scalable web backends, responsive interfaces, and automated developer tools.
    I have <span class="highlight">X+ years of experience</span> delivering production-ready software solutions.<br><br>
    <b>Available for freelance & full-time roles</b> — type <b>hire</b> to get in touch.<br><br>
    Type <b>help</b> to explore available terminal commands.
    </div>
    `;

    const helpMessage = `
    <b>💻 System Commands:</b><br>
    <b>help or h</b>       - Show available commands<br>
    <b>clear or cls</b>    - Clear terminal window<br>
    <b>neofetch or fetch</b> - Display user & environment details<br>
    <br>
    <b>👤 Profile Info:</b><br>
    <b>whoami</b>     - Brief background summary<br>
    <b>experience</b> - Professional background & tenure<br>
    <b>skills</b>     - Technical stack & capabilities<br>
    <b>projects</b>   - Featured software projects<br>
    <b>hire</b>       - Freelance & job availability<br>
    <b>faq</b>        - Frequently asked questions<br>
    <br>
    <b>🌐 Social Links:</b><br>
    <b>linkedin or ln</b>  - Open LinkedIn profile<br>
    <b>github or gh</b>    - Open GitHub profile<br>
    <b>contact or c</b>    - Contact channels<br>
    <br>
    <b>📄 Resume:</b><br>
    <b>resume or r</b>     - Download PDF resume<br>
    `;

    const commands = {
        help: helpMessage,

        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
        <span class="blue">      /\\      </span>  User: yourname
        <span class="blue">     /  \\     </span>  Role: Full-Stack Developer
        <span class="blue">    /    \\    </span>  Location: Your Location
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:your.email@example.com" class="custom-link">your.email@example.com</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://github.com/yourusername" target="_blank" class="custom-link">github.com/yourusername</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://linkedin.com/in/yourusername" target="_blank" class="custom-link">linkedin.com/in/yourusername</a>
        </pre>`;
        },

        whoami: `<b>Your Name</b> — Software Engineer passionate about full-stack web development, API design, and system reliability.`,

        experience: `
        <b>💼 Professional Experience:</b><br><br>
        • <b>Software Engineer @ Company Name</b> (2023 – Present)<br>
          - Engineered scalable RESTful services using Node.js & PostgreSQL.<br>
          - Optimized database queries, reducing response times by 30%.<br><br>
        • <b>Frontend Developer Intern @ Startup Name</b> (2022 – 2023)<br>
          - Built responsive UI components with React & TypeScript.<br>
        `,

        skills: `
        <b>Core Stack:</b><br>
        • <b>Languages:</b> JavaScript, TypeScript, Python, SQL, HTML/CSS<br>
        • <b>Backend:</b> Node.js, Express, Next.js, FastAPI<br>
        • <b>Frontend:</b> React, Tailwind CSS, HTML5/CSS3<br>
        • <b>Databases:</b> PostgreSQL, MongoDB, Redis<br>
        • <b>DevOps & Tools:</b> Git, Docker, Linux, AWS, Postman<br>
        `,

        projects: `
        <b>Featured Projects:</b><br><br>
        • <b>Project Alpha</b> — Web application for real-time data visualizer.<br>
          Tech: React, Node.js, WebSockets, PostgreSQL.<br><br>
        • <b>Project Beta</b> — Automated continuous integration CLI tool.<br>
          Tech: Python, Docker, GitHub Actions.<br><br>
        • <b>Project Gamma</b> — E-commerce API gateway with payment integrations.<br>
          Tech: Express.js, Redis, MongoDB, Stripe API.<br>
        `,

        hire: `
        <b>💼 Hire & Collaborate</b><br><br>
        I am currently available for <b>full-time engineering roles</b> and <b>freelance contracts</b>:<br>
        • Full-stack & backend application development<br>
        • RESTful API integration & database engineering<br>
        • Code reviews & performance optimization<br><br>
        Get in touch → <a href="mailto:your.email@example.com?subject=Project%20Inquiry" class="custom-link">your.email@example.com</a>
        `,

        faq: `
        <b>❓ FAQ</b><br><br>
        <b>What is your main specialization?</b><br>
        Full-stack web applications with an emphasis on robust backend backbones.<br><br>
        <b>Are you available for freelance projects?</b><br>
        Yes, reach out via the email linked in the <b>contact</b> command.<br>
        `,

        contact: `
        <b>Contact Channels:</b><br>
        • Email: <a href="mailto:your.email@example.com" class="custom-link">your.email@example.com</a><br>
        • GitHub: <a href="https://github.com/yourusername" target="_blank" class="custom-link">github.com/yourusername</a><br>
        • LinkedIn: <a href="https://linkedin.com/in/yourusername" target="_blank" class="custom-link">linkedin.com/in/yourusername</a><br>
        `,

        github: () => {
            window.open("https://github.com/yourusername", "_blank");
            return `Opening <a href="https://github.com/yourusername" target="_blank" class="custom-link">GitHub Profile</a>...`;
        },

        linkedin: () => {
            window.open("https://linkedin.com/in/yourusername", "_blank");
            return `Opening <a href="https://linkedin.com/in/yourusername" target="_blank" class="custom-link">LinkedIn Profile</a>...`;
        },

        resume: () => {
            const link = document.createElement("a");
            link.href = "/Resume.pdf";
            link.download = "Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return "Downloading resume...";
        },

        clear: () => resetTerminal(),
        exit: () => resetTerminal(),
    };

    const aliases = {
        gh: "github",
        ln: "linkedin",
        r: "resume",
        c: "contact",
        cls: "clear",
        h: "help",
        fetch: "neofetch",
        exp: "experience"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    function processCommand(cmd) {
        cmd = cmd.toLowerCase();
        if (!cmd) return;

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        if (aliases[cmd]) cmd = aliases[cmd];
        if (cmd === "clear" || cmd === "exit") return resetTerminal();

        let response =
            typeof commands[cmd] === "function"
                ? commands[cmd]()
                : commands[cmd] || getClosestCommand(cmd);

        appendCommand(cmd, response);
    }

    function resetTerminal() {
        output.innerHTML = `<div class="help-message">Type 'help' to see available commands.</div>`;
        input.value = "";
        hint.textContent = "";
    }

    function printWelcome() {
        output.innerHTML = welcomeMessage;
        input.value = "";
        hint.textContent = "";
    }

    function appendCommand(command, result) {
        const commandLine = document.createElement("div");
        commandLine.classList.add("command-line");
        commandLine.innerHTML = `<span class="prompt">λ</span> ${command}`;
        output.appendChild(commandLine);

        const resultLine = document.createElement("div");
        resultLine.classList.add("command-result");
        resultLine.innerHTML = result;
        output.appendChild(resultLine);

        input.scrollIntoView({ behavior: "smooth" });
    }

    function getClosestCommand(inputCmd) {
        const closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch
            ? `Did you mean <b>${closestMatch}</b>?`
            : `Command not found: ${inputCmd}`;
    }

    function updateAutocompleteHint() {
        const currentInput = input.value;
        if (!currentInput) {
            hint.textContent = "";
            return;
        }
        const match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) {
            hint.textContent = match.slice(currentInput.length);
            mirror.textContent = currentInput;
            hint.style.left = mirror.offsetWidth + "px";
        } else {
            hint.textContent = "";
        }
    }

    function autocompleteCommand() {
        const currentInput = input.value;
        if (!currentInput) return;
        const match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) input.value = match;
        hint.textContent = "";
    }

    function createCommandBar() {
        const bar = document.getElementById("command-bar");
        const allCommands = Object.keys(commands);
        [...allCommands].sort().forEach(cmd => {
            const button = document.createElement("button");
            button.textContent = cmd;
            button.dataset.cmd = cmd;
            button.addEventListener("click", () => processCommand(cmd));
            bar.appendChild(button);
        });
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);
    terminal.addEventListener("click", () => input.focus());

    printWelcome();
    createCommandBar();
});