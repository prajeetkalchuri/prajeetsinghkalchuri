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
    <b>Prajeet Singh</b> — Software Engineer based in <span class="highlight">Gurugram, India</span>.<br><br>
    I specialize in enterprise backend engineering, SQL Server optimization, and ASP.NET MVC applications.
    I have <span class="highlight">3+ years of experience</span> building and supporting production supply-chain software.<br><br>
    <b>Open to new opportunities</b> — type <b>hire</b> to get in touch.<br><br>
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
        <span class="blue">      /\\      </span>  User: prajeetsingh
        <span class="blue">     /  \\     </span>  Role: Advanced Application Engineering Senior Analyst
        <span class="blue">    /    \\    </span>  Location: Gurugram, India
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:prajeetsinghkalchuri@gmail.com" class="custom-link">prajeetsinghkalchuri@gmail.com</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://github.com/prajeetkalchuri" target="_blank" class="custom-link">github.com/prajeetkalchuri</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://linkedin.com/in/prajeetsinghkalchuri" target="_blank" class="custom-link">linkedin.com/in/prajeetsinghkalchuri</a>
        </pre>`;
        },

        blogs: () => {
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
                return "Scrolling down to recent tech articles... 👇";
            }
            return `👉 <a href="blog.html" target="_self" style="color: #00ff9d;">Click here to open the standalone Blog Reader</a>`;
        },

       // blogs: () => commands.blog(), bug showing duplicate

        whoami: `<b>Prajeet Singh</b> — Advanced Application Engineering Senior Analyst at Accenture, working on enterprise Supply Chain Management applications. Passionate about backend engineering, SQL optimization, and applying AI/ML (RAG, LLMs) to real production workflows.`,

        experience: `
        <b>💼 Professional Experience:</b><br><br>
        • <b>Advanced Application Engineering Senior Analyst @ Accenture</b> (06/2025 – Present)<br>
          - Own end-to-end development and production support of business-critical Supply Chain Management applications for a large Indian FMCG organization.<br>
          - Led migration of 2 enterprise SCM applications from Mendix low-code to ASP.NET MVC, delivered to production on schedule with zero post-release critical defects.<br>
          - Drove adoption of scalable architectural patterns in C#, ASP.NET MVC, SQL Server, and REST APIs.<br><br>
        • <b>Advanced Application Engineering Analyst @ Accenture</b> (08/2022 – 06/2025)<br>
          - Delivered 20+ end-to-end business features on C#, ASP.NET MVC, JavaScript, and SQL Server.<br>
          - Optimized 100+ SQL Server objects, cutting average query execution time by up to 40%.<br>
          - Automated 10+ business workflows, reducing manual processing effort by 50%.<br>
        `,

        skills: `
        <b>Core Stack:</b><br>
        • <b>Languages:</b> C#, SQL, JavaScript, Python<br>
        • <b>Frameworks & Platforms:</b> ASP.NET MVC, ASP.NET Web API, .NET Framework, REST APIs<br>
        • <b>Databases:</b> Microsoft SQL Server, MySQL — stored procedures, triggers, views, CTEs, window functions, query optimization, SSIS, SSRS<br>
        • <b>AI / ML (learning):</b> RAG, LLMs, vector databases, semantic search<br>
        • <b>Tools:</b> Visual Studio, SSMS, Git, Azure DevOps<br>
        `,

        projects: `
        <b>Featured Projects:</b><br><br>
        • <b>AI-Powered SQL Support Assistant</b> — RAG system that ingests historical SQL scripts and resolution notes, embeds them, and semantically retrieves relevant fixes for new production issues, with an LLM synthesizing recommendations.<br>
          Tech: Python, RAG, LLMs, Vector Search.<br><br>
        • <b>Bank Loan Default Prediction</b> — Analyzed 100,000+ borrower records using SQL Server and Python to engineer risk features and uncover default patterns.<br>
          Tech: SQL, Microsoft SQL Server, Python, Pandas, Scikit-learn.<br>
        `,

        hire: `
        <b>💼 Hire & Collaborate</b><br><br>
        I am currently <b>open to new opportunities</b>:<br>
        • Backend & enterprise application development (.NET / SQL Server)<br>
        • SQL performance tuning & database engineering<br>
        • REST API design & integration<br><br>
        Get in touch → <a href="mailto:prajeetsinghkalchuri@gmail.com?subject=Project%20Inquiry" class="custom-link">prajeetsinghkalchuri@gmail.com</a>
        `,

        faq: `
        <b>❓ FAQ</b><br><br>
        <b>What is your main specialization?</b><br>
        Enterprise backend development on ASP.NET MVC and SQL Server, with growing focus on AI/ML applications.<br><br>
        <b>Are you open to new roles?</b><br>
        Yes, reach out via the email linked in the <b>contact</b> command.<br>
        `,

        contact: `
        <b>Contact Channels:</b><br>
        • Email: <a href="mailto:prajeetsinghkalchuri@gmail.com" class="custom-link">prajeetsinghkalchuri@gmail.com</a><br>
        • GitHub: <a href="https://github.com/prajeetkalchuri" target="_blank" class="custom-link">github.com/prajeetkalchuri</a><br>
        • LinkedIn: <a href="https://linkedin.com/in/prajeetsinghkalchuri" target="_blank" class="custom-link">linkedin.com/in/prajeetsinghkalchuri</a><br>
        `,

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

    // ==========================================
    // 📰 MAIN PAGE BLOG SECTION RENDERER LOGIC
    // ==========================================
// Dynamic Blog Post Auto-Discovery via GitHub API
    window.renderBlogList = async function () {
        const listContainer = document.getElementById('blog-list');
        if (!listContainer) return;

        listContainer.innerHTML = "<p style='color:#8b949e;'>Fetching latest articles from GitHub...</p>";

        const username = "prajeetkalchuri";
        const repo = "prajeetsinghkalchuri";

        try {
            // 1. Ask GitHub API for all files in the /posts folder
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/posts`);
            if (!response.ok) throw new Error("Could not fetch posts directory");

            const files = await response.json();

            // Filter only .md files
            const mdFiles = files.filter(file => file.name.endsWith('.md'));

            if (mdFiles.length === 0) {
                listContainer.innerHTML = "<p>No articles found in posts/ folder.</p>";
                return;
            }

            // 2. Fetch each .md file to extract its Frontmatter title/date/summary
            const postsData = await Promise.all(mdFiles.map(async (file) => {
                const slug = file.name.replace('.md', '');
                const rawRes = await fetch(file.download_url);
                const text = await rawRes.text();

                // Extract Frontmatter metadata between --- lines
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

            // 3. Render posts list dynamically
            listContainer.innerHTML = postsData.map(post => `
      <div class="post-card" onclick="openPost('${post.slug}')" style="padding: 1rem 0; border-bottom: 1px solid #21262d; cursor: pointer;">
        <div class="post-title" style="font-size: 1.2rem; color: #00ff9d; font-weight: bold;">${post.title}</div>
        <div class="post-meta" style="font-size: 0.85rem; color: #8b949e; margin-top: 0.3rem;">${post.date} • Click to read</div>
        <p style="margin: 0.4rem 0 0 0; font-size: 0.95rem; opacity: 0.8; color: #c9d1d9;">${post.summary}</p>
      </div>
    `).join('');

        } catch (err) {
            listContainer.innerHTML = "<p style='color: #f0883e;'>Unable to load articles automatically.</p>";
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