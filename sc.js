// Select the container where cards will be injected
const container = document.getElementById('materialsContainer');

// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// --- RENDER FUNCTION (With Premium Card Design) ---
function renderMaterials(data) {
    container.innerHTML = '';

    // Handle case where no materials match
    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center empty-state animate__animated animate__fadeIn">
                <i class="fa-solid fa-folder-open fa-4x text-muted mb-4 d-block"></i>
                <h4 class="fw-bold">No materials found</h4>
                <p class="text-muted">Try adjusting your keywords or clearing the filters.</p>
                <button class="btn btn-primary rounded-pill mt-3 px-4" onclick="renderMaterials(resources)">Clear Search</button>
            </div>`;
        return;
    }

    data.forEach((item, index) => {
        // 1. Get a safe subject string
        const subjectString = Array.isArray(item.subject) ? item.subject.join(' ') : (item.subject || '');

        // 2. Choose Icon based on subject name
        let iconClass = 'fa-book';
        if (subjectString.includes('Computer')) iconClass = 'fa-laptop-code';
        else if (subjectString.includes('AI ML')) iconClass = 'fa-gears';
        else if (subjectString.includes('Data Analytics')) iconClass = 'fa-chart-pie';
        else if (subjectString.includes('IoT')) iconClass = 'fa-microchip';
        else if (subjectString.includes('CSIT')) iconClass = 'fa-network-wired';

        // 3. Determine File Icon Color
        let fileIcon = 'fa-file-pdf';
        let fileColor = 'text-danger';
        if (item.type === 'PPT') { fileIcon = 'fa-file-powerpoint'; fileColor = 'text-warning'; }
        else if (item.type === 'DOCX') { fileIcon = 'fa-file-word'; fileColor = 'text-primary'; }
        else if (item.type === 'Lab Manual') { fileIcon = 'fa-file-code'; fileColor = 'text-success'; }
        else if (item.type === 'Textbook') { fileIcon = 'fa-book-open'; fileColor = 'text-info'; }

        // 4. Generate Buttons
        let buttonsHTML = '';
        if (item.links) {
            item.links.forEach(link => {
                buttonsHTML += `
                    <a href="${link.url}" class="btn-custom text-decoration-none" target="_blank">
                        <i class="fa-solid fa-link me-2"></i> ${link.name}
                    </a>`;
            });
        } else {
            buttonsHTML = `
                <a href="${item.link}" class="btn-custom text-decoration-none" target="_blank">
                    <i class="fa-solid fa-download me-2"></i> Download
                </a>`;
        }

        // 5. Create the Premium Card HTML with staggered animation
        const card = `
            <div class="col-md-6 col-lg-4" style="animation: fadeInUp 0.5s ease forwards; animation-delay: ${index * 0.1}s; opacity: 0;">
                <div class="material-card">
                    <div class="card-header-custom">
                        <div class="icon-box">
                            <i class="fa-solid ${iconClass}"></i>
                        </div>
                        <span class="sem-badge">${item.semester}</span>
                    </div>

                    <div class="card-body-custom">
                        <h5 class="card-title">${item.title}</h5>
                        
                        <div class="meta-tags">
                            <div class="meta-item">
                                <i class="fa-solid ${fileIcon} ${fileColor}"></i>
                                <span>${item.type}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fa-solid fa-hard-drive text-secondary"></i>
                                <span>${item.size || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="mt-3 text-muted small fw-medium">
                           <i class="fa-solid fa-tag me-1"></i>
                           ${Array.isArray(item.subject) ? item.subject.join(', ') : item.subject}
                        </div>
                    </div>

                    <div class="card-footer-custom">
                        ${buttonsHTML}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// --- SEARCH FUNCTION ---
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        const filtered = resources.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(term);
            const semMatch = item.semester.toLowerCase().includes(term);

            let subjectMatch = false;
            if (Array.isArray(item.subject)) {
                subjectMatch = item.subject.some(sub => sub.toLowerCase().includes(term));
            } else {
                subjectMatch = item.subject.toLowerCase().includes(term);
            }

            return titleMatch || subjectMatch || semMatch;
        });

        renderMaterials(filtered);
    });
}

// --- DEPARTMENT FILTER ---
function filterByDept(deptName) {
    const filtered = resources.filter(item => {
        if (Array.isArray(item.subject)) {
            return item.subject.includes(deptName);
        } else {
            return item.subject === deptName;
        }
    });

    renderMaterials(filtered);

    // Auto-scroll to materials section
    const matSection = document.getElementById('materialsContainer').parentElement;
    if (matSection) {
        matSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initial Load
if (typeof resources !== 'undefined') {
    renderMaterials(resources);
}