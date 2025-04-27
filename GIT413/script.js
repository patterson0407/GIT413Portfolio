document.addEventListener('DOMContentLoaded', function() {

    // --- Get Current Year for Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Project Filtering (Projects Page) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                // Use timeout for smoother visual transition before hiding/showing
                if (filter === 'all' || category === filter) {
                    // Show: remove hidden class first if present, then allow transition
                    item.classList.remove('hidden');
                    item.style.display = ''; // Reset display property
                     // Force reflow to ensure transition runs after display change
                    void item.offsetWidth;
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';

                } else {
                    // Hide: start transition, then set display none after transition ends
                     item.style.opacity = '0';
                     item.style.transform = 'scale(0.8)';
                     // Could use 'transitionend' event listener for cleaner hiding
                     setTimeout(() => {
                        item.classList.add('hidden');
                        item.style.display = 'none'; // Hide completely after transition
                     }, 400); // Match CSS transition duration
                }
            });
        });
    });

    // --- Simple Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine direction based on class (optional)
                let directionClass = '';
                if (entry.target.classList.contains('up')) directionClass = 'up';
                else if (entry.target.classList.contains('down')) directionClass = 'down';
                else if (entry.target.classList.contains('left')) directionClass = 'left';
                else if (entry.target.classList.contains('right')) directionClass = 'right';
                // Add 'is-visible' to trigger CSS transition
                entry.target.classList.add('is-visible');
                // Optional: Remove the direction class after adding is-visible if you only want initial direction
                // if (directionClass) entry.target.classList.remove(directionClass);

                // Stop observing the element once it's revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // Use the viewport as the root
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => {
        // Add initial direction class if not already set (defaults to 'up')
        if (!el.classList.contains('up') && !el.classList.contains('down') && !el.classList.contains('left') && !el.classList.contains('right')) {
            el.classList.add('up'); // Default direction
        }
        revealObserver.observe(el);
    });


    // --- Project Detail Page Loading (Basic Example) ---
    // This part assumes you are on project-detail.html
    if (document.querySelector('.project-detail-page')) {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('project');
        const projectContentEl = document.getElementById('project-content');
        const loadingIndicatorEl = document.getElementById('loading-indicator');

        if (projectId && projectContentEl) {
            // Show loading indicator (optional)
             if (loadingIndicatorEl) loadingIndicatorEl.style.display = 'block';
             projectContentEl.style.display = 'none'; // Hide template while loading

            loadProjectDetails(projectId);
        } else if (projectContentEl) {
             projectContentEl.innerHTML = '<p class="text-center text-danger">Could not identify project. Please return to the vault.</p>'; // Error message
        }
    }

     // --- Contact Form Handling (Basic Frontend) ---
     const contactForm = document.getElementById('contact-form');
     const formStatus = document.getElementById('form-status');

     if (contactForm) {
         contactForm.addEventListener('submit', function(event) {
             event.preventDefault(); // Prevent default browser submission

             const formData = new FormData(contactForm);
             const submitButton = contactForm.querySelector('button[type="submit"]');
             submitButton.disabled = true; // Disable button during submission
             submitButton.innerHTML = 'Transmitting... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
             if(formStatus) formStatus.textContent = ''; // Clear previous status

             // Replace with your actual backend endpoint (e.g., Formspree, Netlify Forms, custom backend)
             const endpoint = contactForm.action || "YOUR_BACKEND_ENDPOINT_HERE"; // Get action from form or fallback

             // Example using fetch API (adjust headers/method if needed for your backend)
             fetch(endpoint, {
                 method: 'POST',
                 body: formData,
                 headers: {
                    // 'Accept': 'application/json' // Uncomment if your endpoint returns JSON
                 }
             })
             .then(response => {
                 if (response.ok) {
                     // Assuming successful submission if response is ok
                     return response.text(); // Or response.json() if applicable
                 } else {
                     // Try to get error details if possible
                     return response.text().then(text => { throw new Error(text || `Transmission failed with status: ${response.status}`) });
                 }
             })
             .then(data => {
                 console.log('Success:', data);
                 if(formStatus) {
                     formStatus.textContent = '✨ Message Transmitted Successfully! ✨';
                     formStatus.className = 'mt-3 text-center text-success'; // Style success message
                 }
                 contactForm.reset(); // Clear the form
             })
             .catch(error => {
                 console.error('Error:', error);
                 if(formStatus) {
                    formStatus.textContent = `🔥 Transmission Failed: ${error.message || 'Please try again.'} 🔥`;
                    formStatus.className = 'mt-3 text-center text-danger'; // Style error message
                 }
             })
             .finally(() => {
                 // Re-enable button regardless of outcome
                 submitButton.disabled = false;
                 submitButton.innerHTML = 'Transmit <i class="fas fa-paper-plane" aria-hidden="true"></i>';
             });
         });
     }

}); // End DOMContentLoaded

// --- Helper Function for Project Details (Replace with actual data source) ---
function loadProjectDetails(projectId) {
    console.log(`Loading details for project: ${projectId}`);
     const projectContentEl = document.getElementById('project-content');
     const loadingIndicatorEl = document.getElementById('loading-indicator');

    // **IMPORTANT**: Replace this with your actual data fetching logic.
    // This could be:
    // 1. Predefined objects in JavaScript.
    // 2. Fetching a JSON file (`Workspace('data/projects.json')`).
    // 3. Fetching from a CMS or database API.

    // Example using predefined data:
    const projectData = {
        'project1': {
            title: "DeFi Dashboard Alchemia",
            image: "assets/images/project-mockup-defi.png", // Specific image
            challenge: "The arcane users of decentralized finance lacked a unified portal to view their scattered assets across multiple chains and protocols. The challenge was to create a dashboard that aggregates data clearly and securely.",
            tools: ["React (Lightning Spell)", "Ethers.js (Chain Connector)", "TheGraph (Data Indexing)", "Solidity (Smart Contract Interaction - read-only)", "Bootstrap (Layout Runes)"],
            process: "Researched common DeFi protocols, designed user flows for connecting wallets and displaying balances. Developed components for different asset types (tokens, LPs, staking). Integrated APIs and blockchain data sources. Focused on clear data visualization and responsive design.",
            outcome: "A functional dashboard prototype allowing users to connect wallets (like MetaMask) and view token balances and basic protocol positions across Ethereum and Polygon. Improved user visibility into their DeFi portfolio.",
            github: "https://github.com/yourusername/defi-dashboard",
            live: "#" // Use actual link or "#" if no live demo
        },
        'project2': {
            title: "Pixel Alchemist Game",
            image: "assets/images/project-mockup-game.png",
            challenge: "Create a simple browser-based game combining pixel art aesthetics with an alchemy/crafting theme.",
            tools: ["HTML5 Canvas (Drawing Surface)", "JavaScript (Game Logic)", "CSS (Styling)", "Aseprite (Pixel Art)"],
            process: "Designed core game loop: gather ingredients, combine them based on recipes, discover new recipes. Implemented canvas drawing for game world and character sprites. Wrote logic for player movement, inventory management, and crafting system. Created pixel art assets.",
            outcome: "A playable browser game demo with basic gathering and crafting mechanics. Explored game development principles and canvas rendering.",
            github: "https://github.com/yourusername/pixel-alchemist",
            live: "#"
        },
         'project3': {
            title: "Arcane Design System Portal",
            image: "assets/images/project-mockup-designsys.png",
            challenge: "Document and present a reusable component library (design system) in an accessible and interactive way for a team of developers and designers.",
            tools: ["React (Component Examples)", "Storybook (Component Workshop)", "CSS Modules (Scoped Styling)", "Markdown (Documentation)"],
            process: "Defined core design tokens (colors, typography, spacing). Built foundational UI components (buttons, inputs, cards) in React. Integrated Storybook to provide interactive examples and documentation for each component. Wrote usage guidelines in Markdown.",
            outcome: "A deployed Storybook instance showcasing the design system components, their variations, usage instructions, and code snippets. Improved consistency and development speed for UI tasks.",
            github: "https://github.com/yourusername/design-system",
            live: "#" // Link to deployed Storybook
        }
        // Add data for other projects...
    };

    const data = projectData[projectId];

    // Simulate network delay (remove in production)
    setTimeout(() => {
        if (data) {
            document.title = `${data.title} - The Alchemist's Lab`; // Update page title

            document.getElementById('project-title').textContent = data.title;
            document.getElementById('project-image').src = data.image || 'assets/images/project-mockup.png'; // Use specific or default image
            document.getElementById('project-image').alt = `${data.title} Mockup`;
            document.getElementById('project-challenge').querySelector('p').textContent = data.challenge;

            const toolsList = document.getElementById('tools-list');
            toolsList.innerHTML = ''; // Clear placeholder
            data.tools.forEach(tool => {
                const li = document.createElement('li');
                li.textContent = tool;
                toolsList.appendChild(li);
            });

            document.getElementById('project-process').querySelector('p').textContent = data.process;
            document.getElementById('project-outcome').querySelector('p').textContent = data.outcome;

            const githubLink = document.getElementById('project-github-link');
            const liveLink = document.getElementById('project-live-link');

            if (data.github && data.github !== '#') {
                 githubLink.href = data.github;
                 githubLink.style.display = ''; // Show button
            } else {
                githubLink.style.display = 'none'; // Hide button if no link
            }

             if (data.live && data.live !== '#') {
                 liveLink.href = data.live;
                 liveLink.style.display = ''; // Show button
             } else {
                 liveLink.style.display = 'none'; // Hide button if no link
             }


            // Show content, hide loading indicator
            projectContentEl.style.display = 'block';
            if (loadingIndicatorEl) loadingIndicatorEl.style.display = 'none';

             // Re-run scroll reveal setup for the newly loaded content
             const newRevealElements = projectContentEl.querySelectorAll('.scroll-reveal');
             const newRevealObserver = new IntersectionObserver((entries, observer) => {
                 entries.forEach(entry => {
                     if (entry.isIntersecting) {
                         entry.target.classList.add('is-visible');
                         observer.unobserve(entry.target);
                     }
                 });
             }, { threshold: 0.1 });
             newRevealElements.forEach(el => {
                 if (!el.classList.contains('up') && !el.classList.contains('down') && !el.classList.contains('left') && !el.classList.contains('right')) {
                    el.classList.add('up'); // Add default direction
                 }
                 newRevealObserver.observe(el);
            });


        } else {
             projectContentEl.innerHTML = `<p class="text-center text-danger">Error: Project details for "${projectId}" not found.</p>`;
             projectContentEl.style.display = 'block';
             if (loadingIndicatorEl) loadingIndicatorEl.style.display = 'none';
        }
    }, 500); // End simulated delay
}