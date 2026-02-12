// // Select the container where cards will be injected
// const container = document.getElementById('materialsContainer');

// // --- RENDER FUNCTION (With Premium Card Design) ---
// function renderMaterials(data) {
//     container.innerHTML = ''; 

//     if (data.length === 0) {
//         container.innerHTML = '<div class="col-12 text-center text-muted p-5"><h4>No materials found :(</h4></div>';
//         return;
//     }

//     data.forEach(item => {
//         // 1. Choose Icon based on subject name
//         let iconClass = 'fa-book';
//         if(item.subject.includes('Computer')) iconClass = 'fa-laptop-code';
//         else if(item.subject.includes('Engineer')) iconClass = 'fa-gears';
//         else if(item.subject.includes('Business')) iconClass = 'fa-chart-pie';
//         else if(item.subject.includes('Art')) iconClass = 'fa-palette';

//         // 2. Determine File Icon Color (PDF red, PPT orange, etc.)
//         let fileIcon = 'fa-file-pdf';
//         let fileColor = 'text-danger'; 
//         if(item.type === 'PPT') { fileIcon = 'fa-file-powerpoint'; fileColor = 'text-warning'; }
//         if(item.type === 'DOCX') { fileIcon = 'fa-file-word'; fileColor = 'text-primary'; }

//         // 3. Generate Buttons (Handles both single link and multiple links)
//         let buttonsHTML = '';
//         if (item.links) {
//             item.links.forEach(link => {
//                 buttonsHTML += `
//                     <a href="${link.url}" class="btn-custom text-decoration-none">
//                         <i class="fa-solid fa-link me-2"></i> ${link.name}
//                     </a>`;
//             });
//         } else {
//             buttonsHTML = `
//                 <a href="${item.link}" class="btn-custom text-decoration-none">
//                     <i class="fa-solid fa-download me-2"></i> Download
//                 </a>`;
//         }

//         // 4. Create the Premium Card HTML
//         const card = `
//             <div class="col-md-6 col-lg-4">
//                 <div class="material-card">
//                     <div class="card-header-custom">
//                         <div class="icon-box">
//                             <i class="fa-solid ${iconClass}"></i>
//                         </div>
//                         <span class="sem-badge">${item.semester}</span>
//                     </div>

//                     <div class="card-body-custom">
//                         <h5 class="card-title">${item.title}</h5>
                        
//                         <div class="meta-tags">
//                             <div class="meta-item">
//                                 <i class="fa-solid ${fileIcon} ${fileColor}"></i>
//                                 <span>${item.type}</span>
//                             </div>
//                             <div class="meta-item">
//                                 <i class="fa-solid fa-hard-drive text-secondary"></i>
//                                 <span>${item.size}</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="card-footer-custom">
//                         ${buttonsHTML}
//                     </div>
//                 </div>
//             </div>
//         `;
//         container.innerHTML += card;
//     });
// }

// // --- SEARCH FUNCTION ---
// const searchInput = document.getElementById('searchInput');
// if(searchInput) {
//     searchInput.addEventListener('keyup', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = resources.filter(item => 
//             item.title.toLowerCase().includes(term) || 
//             item.subject.toLowerCase().includes(term) ||
//             item.semester.toLowerCase().includes(term)
//         );
//         renderMaterials(filtered);
//     });
// }

// // --- DEPARTMENT FILTER ---
// function filterByDept(deptName) {
//     const filtered = resources.filter(item => item.subject === deptName);
//     renderMaterials(filtered);
    
//     // Auto-scroll to materials section
//     const matContainer = document.getElementById('materialsContainer');
//     if(matContainer) {
//         matContainer.scrollIntoView({behavior: 'smooth'});
//     }
// }

// // Initial Load (Show all resources when page opens)
// renderMaterials(resources);
// ===== CONTAINER =====
const container = document.getElementById('materialsContainer');


// ===== RENDER FUNCTION =====
function renderMaterials(data) {

    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML =
            '<div class="col-12 text-center text-muted p-5"><h4>No materials found :(</h4></div>';
        return;
    }

    data.forEach(item => {

        // Handle subject array or string
        const subjectText = Array.isArray(item.subject)
            ? item.subject.join(" ")
            : item.subject;

        // Icon selection
        let iconClass = 'fa-book';

        if (subjectText.includes('Computer')) iconClass = 'fa-laptop-code';
        else if (subjectText.includes('AI ML')) iconClass = 'fa-gears';
        else if (subjectText.includes('Data Analytics')) iconClass = 'fa-chart-pie';
        else if (subjectText.includes('IoT')) iconClass = 'fa-palette';

        // File icon
        let fileIcon = 'fa-file-pdf';
        let fileColor = 'text-danger';

        if (item.type === 'PPT') {
            fileIcon = 'fa-file-powerpoint';
            fileColor = 'text-warning';
        }

        if (item.type === 'DOCX') {
            fileIcon = 'fa-file-word';
            fileColor = 'text-primary';
        }

        // Buttons
        let buttonsHTML = '';

        if (item.links) {
            item.links.forEach(link => {
                buttonsHTML += `
                    <a href="${link.url}" class="btn-custom text-decoration-none">
                        <i class="fa-solid fa-link me-2"></i>${link.name}
                    </a>`;
            });
        } else {
            buttonsHTML = `
                <a href="${item.link}" class="btn-custom text-decoration-none">
                    <i class="fa-solid fa-download me-2"></i>Download
                </a>`;
        }

        // Card HTML
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


// ===== SEARCH =====
const searchInput = document.getElementById('searchInput');

if (searchInput) {

    searchInput.addEventListener('keyup', e => {

        const term = e.target.value.toLowerCase();

        const filtered = resources.filter(item => {

            const subjectText = Array.isArray(item.subject)
                ? item.subject.join(" ").toLowerCase()
                : item.subject.toLowerCase();

            return (
                item.title.toLowerCase().includes(term) ||
                subjectText.includes(term) ||
                item.semester.toLowerCase().includes(term)
            );
        });

        renderMaterials(filtered);
    });
}


// ===== DEPARTMENT FILTER (supports arrays) =====
function filterByDept(deptName) {

    const filtered = resources.filter(item => {

        if (Array.isArray(item.department)) {
            return item.department.includes(deptName);
        }

        return item.department === deptName;
    });

    renderMaterials(filtered);

    container.scrollIntoView({ behavior: 'smooth' });
}


// ===== INITIAL LOAD =====
renderMaterials(resources);
