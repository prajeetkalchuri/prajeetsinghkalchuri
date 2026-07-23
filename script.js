document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    // ----------------------------------------------------
    // 🧙‍♂️ CONTACT WIZARD STATE MACHINE
    // ----------------------------------------------------
    let isWizardActive = false;
    let wizardStep = 0;
    let wizardData = { name: "", email: "", message: "" };

    // formepree end point for mails -- contact
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqrdkoo";

    const welcomeMessage = `
    <div class="welcome">
    <span class="prompt">λ</span> whoami<br>
    <b>Prajeet Singh</b> — Software Engineer based in <span class="highlight">Gurugram, India</span>.<br><br>
    I specialize in enterprise backend engineering, SQL Server optimization, and ASP.NET MVC applications.<br><br>
    <b>Open to new opportunities</b> — type <b>contact --send</b> to launch the interactive message wizard.<br><br>
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
    <b>blog or blogs</b> - Read tech articles & engineering notes<br>
    <b>hire or contact</b> - Contact channels & info<br>
    <b>contact --send</b>  - ⚡ Launch interactive inline contact wizard<br>
    <b>faq</b>        - Frequently asked questions<br>
    <br>
    <b>🌐 Social Links:</b><br>
    <b>linkedin or ln</b>  - Open LinkedIn profile<br>
    <b>github or gh</b>    - Open GitHub profile<br>
    <br>
    <b>📄 Resume:</b><br>
    <b>resume or r</b>     - Download PDF resume<br>
    `;

    const commands = {
        help: helpMessage,

        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
        <span class="blue">      /\\      </span>  User: prajeetsingh
        <span class="blue">     /  \\     </span>  Role: Advanced Application Engineering Senior Analyst
        <span class="blue">    /    \\    </span>  Location: Gurugram, India
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:prajeetsinghkalchuri@gmail.com" class="custom-link">prajeetsinghkalchuri@gmail.com</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://github.com/prajeetkalchuri" target="_blank" class="custom-link">github.com/prajeetkalchuri</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://linkedin.com/in/prajeetsinghkalchuri" target="_blank" class="custom-link">linkedin.com/in/prajeetsinghkalchuri</a>
        </pre>`;
        },

        blog: () => {
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
                return "Scrolling down to recent tech articles... 👇";
            }
            return `👉 <a href="blog.html" target="_self" style="color: #00ff9d;">Click here to open the standalone Blog Reader</a>`;
        },

        whoami: `<b>Prajeet Singh</b> — Advanced Application Engineering Senior Analyst at Accenture, working on enterprise Supply Chain Management applications. Passionate about backend engineering, SQL optimization, and applying AI/ML (RAG, LLMs) to real production workflows.`,

        experience: `
        <b>💼 Professional Experience:</b><br><br>
        • <b>Advanced Application Engineering Senior Analyst @ Accenture</b> (06/2025 – Present)<br>
          - Own end-to-end development and production support of business-critical Supply Chain Management applications.<br>
          - Led migration of 2 enterprise SCM applications from Mendix low-code to ASP.NET MVC.<br><br>
        • <b>Advanced Application Engineering Analyst @ Accenture</b> (08/2022 – 06/2025)<br>
          - Delivered 20+ end-to-end business features on C#, ASP.NET MVC, JavaScript, and SQL Server.<br>
          - Optimized 100+ SQL Server objects, cutting query execution times by up to 40%.<br>
        `,

        skills: `
        <b>Core Stack:</b><br>
        • <b>Languages:</b> C#, SQL, JavaScript, Python<br>
        • <b>Frameworks:</b> ASP.NET MVC, ASP.NET Web API, .NET Framework, REST APIs<br>
        • <b>Databases:</b> Microsoft SQL Server, MySQL, SSIS, SSRS<br>
        • <b>Tools:</b> Visual Studio, SSMS, Git, Azure DevOps<br>
        `,

        projects: `
        <b>Featured Projects:</b><br><br>
        • <b>AI-Powered SQL Support Assistant</b> — RAG system that ingests historical SQL scripts and retrieves relevant fixes.<br>
        • <b>Bank Loan Default Prediction</b> — Analyzed 100,000+ borrower records using SQL Server and Python.<br>
        `,

        hire: () => commands.contact(),

        faq: `
        <b>❓ FAQ</b><br><br>
        <b>What is your main specialization?</b><br>
        Enterprise backend development on ASP.NET MVC and SQL Server.<br><br>
        <b>How can I send a message?</b><br>
        Type <b>contact --send</b> to launch the inline contact wizard!<br>
        `,

        contact: (args = "") => {
            if (args.includes("--send") || args.includes("-s")) {
                startContactWizard();
                return "";
            }
            return `
            <b>Contact Channels:</b><br>
            • Email: <a href="mailto:prajeetsinghkalchuri@gmail.com" class="custom-link">prajeetsinghkalchuri@gmail.com</a><br>
            • GitHub: <a href="https://github.com/prajeetkalchuri" target="_blank" class="custom-link">github.com/prajeetkalchuri</a><br>
            • LinkedIn: <a href="https://linkedin.com/in/prajeetsinghkalchuri" target="_blank" class="custom-link">linkedin.com/in/prajeetsinghkalchuri</a><br><br>
            ⚡ <b>Send Direct Message:</b> Type <b style="color:#00ff9d;">contact --send</b> to launch the interactive wizard!
            `;
        },

        github: () => {
            window.open("https://github.com/prajeetkalchuri", "_blank");
            return `Opening <a href="https://github.com/prajeetkalchuri" target="_blank" class="custom-link">GitHub Profile</a>...`;
        },

        linkedin: () => {
            window.open("https://linkedin.com/in/prajeetsinghkalchuri", "_blank");
            return `Opening <a href="https://linkedin.com/in/prajeetsinghkalchuri" target="_blank" class="custom-link">LinkedIn Profile</a>...`;
        },

        resume: () => {
            const link = document.createElement("a");
            link.href = "Resume.pdf";
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
        exp: "experience",
        blogs: "blog"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    // ----------------------------------------------------
    // WIZARD CONTROLLER FUNCTIONS
    // ----------------------------------------------------
    function startContactWizard() {
        isWizardActive = true;
        wizardStep = 1;
        wizardData = { name: "", email: "", message: "" };

        appendWizardLine("📬 <b>Contact Wizard Started</b> (Type 'cancel' anytime to exit)");
        appendWizardPrompt("Step 1/3: Enter your full Name:");
    }

    function processWizardStep(val) {
        val = val.trim();

        if (val.toLowerCase() === "cancel") {
            isWizardActive = false;
            appendWizardLine("❌ Wizard cancelled.");
            return;
        }

        if (wizardStep === 1) {
            if (!val) {
                appendWizardPrompt("Name cannot be empty. Please enter your Name:");
                return;
            }
            wizardData.name = val;
            wizardStep = 2;
            appendWizardLine(`Name: <span style="color:#00ff9d;">${val}</span>`);
            appendWizardPrompt("Step 2/3: Enter your Email address:");
        } 
        else if (wizardStep === 2) {
            if (!val || !val.includes("@")) {
                appendWizardPrompt("Please enter a valid Email address:");
                return;
            }
            wizardData.email = val;
            wizardStep = 3;
            appendWizardLine(`Email: <span style="color:#00ff9d;">${val}</span>`);
            appendWizardPrompt("Step 3/3: Enter your Message:");
        } 
        else if (wizardStep === 3) {
            if (!val) {
                appendWizardPrompt("Message cannot be empty. Enter your Message:");
                return;
            }
            wizardData.message = val;
            appendWizardLine(`Message: <span style="color:#00ff9d;">${val}</span>`);
            
            // Finalize & Send
            isWizardActive = false;
            sendEmailMessage();
        }
    }

    async function sendEmailMessage() {
        appendWizardLine("⏳ <i>Sending message to Prajeet...</i>");

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: wizardData.name,
                    email: wizardData.email,
                    message: wizardData.message
                })
            });

            if (response.ok) {
                appendWizardLine("✅ <b>Message sent successfully!</b> Prajeet will reply to your email shortly.");
            } else {
                appendWizardLine("⚠️ <b>Delivery error.</b> Please email directly: <a href='mailto:prajeetsinghkalchuri@gmail.com' class='custom-link'>prajeetsinghkalchuri@gmail.com</a>");
            }
        } catch (err) {
            appendWizardLine("⚠️ <b>Network error.</b> Please reach out via email: <a href='mailto:prajeetsinghkalchuri@gmail.com' class='custom-link'>prajeetsinghkalchuri@gmail.com</a>");
        }
    }

    function appendWizardLine(text) {
        const line = document.createElement("div");
        line.classList.add("command-result");
        line.innerHTML = text;
        output.appendChild(line);
        input.scrollIntoView({ behavior: "smooth" });
    }

    function appendWizardPrompt(text) {
        const promptLine = document.createElement("div");
        promptLine.classList.add("command-line");
        promptLine.style.color = "#f0883e";
        promptLine.innerHTML = `➔ ${text}`;
        output.appendChild(promptLine);
        input.scrollIntoView({ behavior: "smooth" });
    }

    // ----------------------------------------------------
    // INPUT KEYBOARD LISTENER
    // ----------------------------------------------------
    function processCommand(rawInput) {
        const trimmed = rawInput.trim();
        
        // Handle Contact Wizard Interception
        if (isWizardActive) {
            appendCommand(rawInput, "");
            processWizardStep(trimmed);
            return;
        }

        if (!trimmed) return;

        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        const parts = trimmed.split(" ");
        let mainCmd = parts[0].toLowerCase();
        let args = parts.slice(1).join(" ");

        if (aliases[mainCmd]) mainCmd = aliases[mainCmd];
        if (mainCmd === "clear" || mainCmd === "exit") return resetTerminal();

        let response;
        if (typeof commands[mainCmd] === "function") {
            response = commands[mainCmd](args);
        } else {
            response = commands[mainCmd] || getClosestCommand(mainCmd);
        }

        if (response) {
            appendCommand(trimmed, response);
        }
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

        if (result) {
            const resultLine = document.createElement("div");
            resultLine.classList.add("command-result");
            resultLine.innerHTML = result;
            output.appendChild(resultLine);
        }

        input.scrollIntoView({ behavior: "smooth" });
    }

    function getClosestCommand(inputCmd) {
        const closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch
            ? `Did you mean <b>${closestMatch}</b>?`
            : `Command not found: ${inputCmd}`;
    }

    function updateAutocompleteHint() {
        if (isWizardActive) {
            hint.textContent = "";
            return;
        }
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
        if (isWizardActive) return;
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
            button.addEventListener("click", () => {
                if (cmd === "contact") {
                    processCommand("contact --send");
                } else {
                    processCommand(cmd);
                }
            });
            bar.appendChild(button);
        });
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value);
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!isWizardActive && historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!isWizardActive && historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else if (!isWizardActive) {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);
    terminal.addEventListener("click", () => input.focus());

    printWelcome();
    createCommandBar();

    // ==========================================
    // 📰 AUTOMATED GITHUB API BLOG RENDERER LOGIC
    // ==========================================
    window.renderBlogList = async function() {
      const listContainer = document.getElementById('blog-list');
      if (!listContainer) return;

      listContainer.innerHTML = "<p style='color:#8b949e;'>Fetching latest articles...</p>";

      const username = "prajeetkalchuri";
      const repo = "prajeetsinghkalchuri";

      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/posts`);
        if (!response.ok) throw new Error("Could not fetch posts directory");
        
        const files = await response.json();
        const mdFiles = files.filter(file => file.name.endsWith('.md'));

        if (mdFiles.length === 0) {
          listContainer.innerHTML = "<p>No articles found in posts/ folder.</p>";
          return;
        }

        const postsData = await Promise.all(mdFiles.map(async (file) => {
          const slug = file.name.replace('.md', '');
          const rawRes = await fetch(file.download_url);
          const text = await rawRes.text();

          const titleMatch = text.match(/title:\s*(.*)/i);
          const dateMatch = text.match(/date:\s*(.*)/i);
          const summaryMatch = text.match(/summary:\s*(.*)/i);

          return {
            slug: slug,
            title: titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' '),
            date: dateMatch ? dateMatch[1].trim() : 'Recent',
            summary: summaryMatch ? summaryMatch[1].trim() : ''
          };
        }));

        listContainer.innerHTML = postsData.map(post => `
          <div class="post-card" onclick="openPost('${post.slug}')" style="padding: 1rem 0; border-bottom: 1px solid #21262d; cursor: pointer;">
            <div class="post-title" style="font-size: 1.2rem; color: #00ff9d; font-weight: bold;">${post.title}</div>
            <div class="post-meta" style="font-size: 0.85rem; color: #8b949e; margin-top: 0.3rem;">${post.date} • Click to read</div>
            <p style="margin: 0.4rem 0 0 0; font-size: 0.95rem; opacity: 0.8; color: #c9d1d9;">${post.summary}</p>
          </div>
        `).join('');

      } catch (err) {
        listContainer.innerHTML = "<p style='color: #8b949e;'>No articles found or error loading posts.</p>";
      }
    };

    window.openPost = async function(slug) {
      const listContainer = document.getElementById('blog-list');
      const contentContainer = document.getElementById('blog-content');

      try {
        const response = await fetch(`posts/${slug}.md`);
        if (!response.ok) throw new Error("Article file not found");
        
        const markdown = await response.text();

        listContainer.style.display = 'none';
        contentContainer.style.display = 'block';
        
        contentContainer.innerHTML = `
          <button onclick="closePost()" style="background: #21262d; color: #58a6ff; border: 1px solid #30363d; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; margin-bottom: 1rem;">← Back to all articles</button>
          <div class="markdown-body">${marked.parse(markdown)}</div>
        `;
        
        document.getElementById('blog-section').scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        alert("Unable to load article. Make sure posts/" + slug + ".md exists in your GitHub repository.");
      }
    };

    window.closePost = function() {
      document.getElementById('blog-list').style.display = 'block';
      document.getElementById('blog-content').style.display = 'none';
    };

    renderBlogList();
});