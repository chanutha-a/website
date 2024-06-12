document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('commandInput');
    const outputDiv = document.getElementById('output');

    let currentDirectory = ''; // Variable to track the current directory
    let projectsData = []; // Aray to store projects data
    let commandHistory = []; // Array to store command history
    let historyIndex = -1; // Index to track the current position in command history

    const commands = {
        help: `
Available commands:
--help              Show available commands
--about             Information about me
--skills            List of my skills
--projects          Details about my projects. Use "cd [project name]" to navigate into a project.
--contact           How to contact me
        `,
        about: `
My Name: Chanutha Adikary
Interests: Cybersecurity, Hacking, Programming, Software Development, Ego peaking T ramp from top mid cus im better
        `,
        skills: `
Skills:
- Python
- JavaScript/ HTML/ CSS
- 0% 1v5 win rate
        `,
        contact: `
Contact: 07495182034 - 100% of the time I pick up 50% of the time
Email: Chanutha.adikary@outlook.com
        `
    };

    commandInput.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Enter':
                handleEnterKey();
                break;
            case 'ArrowUp':
                handleArrowUpKey();
                break;
            case 'ArrowDown':
                handleArrowDownKey();
                break;
        }
    });

    function handleEnterKey() {
        const command = commandInput.value.trim();
        handleCommand(command);
        commandInput.value = '';
    }

    function handleArrowUpKey() {
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[historyIndex];
        }
    }

    function handleArrowDownKey() {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[historyIndex];
        } else if (historyIndex === commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = '';
        }
    }

    function handleCommand(command) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        const [cmd, ...args] = command.split(' '); // Split command into command and arguments

        switch (cmd) {
            case '--help':
                appendOutput(commands.help + '\n');
                break;
            case '--about':
            case '--skills':
            case '--contact':
                appendOutput(`user@terminal:${currentDirectory}$ ${command}\n${commands[cmd.substring(2)]}\n`);
                break;
            case '--projects':
                fetchProjects();
                break;
            case 'cd':
                changeDirectory(args);
                break;
            default:
                appendOutput(`user@terminal:${currentDirectory}$ ${command}\nCommand not found. Type --help for a list of commands.\n`);
        }
    }

    function fetchProjects() {
        fetch('projects.json')
            .then(response => response.json())
            .then(projects => {
                projectsData = projects;
                let projectsList = 'Projects:\n';
                projects.forEach(project => {
                    projectsList += `- ${project.name}\n`;
                });
                appendOutput(projectsList);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                appendOutput('Failed to fetch project details.\n');
            });
    }

    function changeDirectory(args) {
        const [projectName] = args;
        if (!projectName) {
            appendOutput(`user@terminal:${currentDirectory}$ cd: missing operand\n`);
            return;
        }

        if (projectName === '..') {
            // Navigate back to the main directory
            currentDirectory = '';
            appendOutput(`user@terminal:${currentDirectory}$ cd ..\n`);
            return;
        }

        const project = projectsData.find(p => p.name.toLowerCase() === projectName.toLowerCase());
        if (project) {
            currentDirectory = project.name;
            appendOutput(`user@terminal:${currentDirectory}$ cd ${project.name}\n${project.description}\n`);
        } else {
            appendOutput(`user@terminal:${currentDirectory}$ cd: ${projectName}: No such file or directory\n`);
        }
    }

    function appendOutput(text) {
        outputDiv.innerText += text;
        outputDiv.scrollTop = outputDiv.scrollHeight;  // Scroll to bottom
        commandInput.focus();
    }

    appendOutput(`Type --help for a list of commands.\n`);
});
