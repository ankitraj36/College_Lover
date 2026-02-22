// Select the container where cards will be injected
const container = document.getElementById('materialsContainer');

// --- RENDER FUNCTION (With Premium Card Design) ---
function renderMaterials(data) {
    container.innerHTML = ''; 

    // Handle case where no materials match
    if (data.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted p-5"><h4>No materials found :(</h4></div>';
        return;
    }

    data.forEach(item => {
        // --- MODIFIED: Handle Subject Array for Icon Logic ---
        // 1. Get a safe subject string (Handles Array ["A","B"] or String "A")
        // We use this string specifically for checking which Icon to show.
        const subjectString = Array.isArray(item.subject) ? item.subject.join(' ') : (item.subject || '');

        // 2. Choose Icon based on subject name
        let iconClass = 'fa-book';
        // Check the string we just created
        if(subjectString.includes('Computer')) iconClass = 'fa-laptop-code';
        else if(subjectString.includes('AI ML')) iconClass = 'fa-gears';
        else if(subjectString.includes('Data Analytics')) iconClass = 'fa-chart-pie';
        else if(subjectString.includes('IoT')) iconClass = 'fa-palette';

        // 3. Determine File Icon Color (PDF red, PPT orange, etc.)
        let fileIcon = 'fa-file-pdf';
        let fileColor = 'text-danger'; 
        if(item.type === 'PPT') { fileIcon = 'fa-file-powerpoint'; fileColor = 'text-warning'; }
        else if(item.type === 'DOCX') { fileIcon = 'fa-file-word'; fileColor = 'text-primary'; }
        else if(item.type === 'Lab Manual') { fileIcon = 'fa-file-code'; fileColor = 'text-success'; }

        // 4. Generate Buttons (Handles both single link and multiple links)
        let buttonsHTML = '';
        if (item.links) {
            item.links.forEach(link => {
                buttonsHTML += `
                    <a href="${link.url}" class="btn-custom text-decoration-none">
                        <i class="fa-solid fa-link me-2"></i> ${link.name}
                    </a>`;
            });
        } else {
            buttonsHTML = `
                <a href="${item.link}" class="btn-custom text-decoration-none">
                    <i class="fa-solid fa-download me-2"></i> Download
                </a>`;
        }

        // 5. Create the Premium Card HTML
        // Note: I added a small section to display the subjects textually if it's an array
        const card = `
            <div class="col-md-6 col-lg-4">
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
                                <span>${item.size}</span>
                            </div>
                        </div>
                        
                        <div class="mt-2 text-muted small">
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
if(searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        
        const filtered = resources.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(term);
            const semMatch = item.semester.toLowerCase().includes(term);
            
            // --- MODIFIED: Handle Array in Search ---
            let subjectMatch = false;
            if (Array.isArray(item.subject)) {
                // If array, check if ANY item in array matches the search term
                subjectMatch = item.subject.some(sub => sub.toLowerCase().includes(term));
            } else {
                // If string, simple check
                subjectMatch = item.subject.toLowerCase().includes(term);
            }

            return titleMatch || subjectMatch || semMatch;
        });
        
        renderMaterials(filtered);
    });
}

// --- DEPARTMENT FILTER ---
function filterByDept(deptName) {
    // --- MODIFIED: Handle Array in Filter ---
    const filtered = resources.filter(item => {
        // Handle if subject is Array (e.g., ["AI ML", "IoT"])
        if (Array.isArray(item.subject)) {
            return item.subject.includes(deptName);
        } 
        // Handle if subject is String (e.g., "AI ML")
        else {
            return item.subject === deptName;
        }
    });

    renderMaterials(filtered);
    
    // Auto-scroll to materials section
    const matContainer = document.getElementById('materialsContainer');
    if(matContainer) {
        matContainer.scrollIntoView({behavior: 'smooth'});
    }
}

// Initial Load (Show all resources when page opens)
if (typeof resources !== 'undefined') {
    renderMaterials(resources);
}