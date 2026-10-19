const projects = document.querySelectorAll('.work-rectangle');
const prevButton = document.getElementById('prev-project');
const nextButton = document.getElementById('next-project');

let currentProject = 0;

function selectProject(index) {
    currentProject = (index + projects.length) % projects.length;

    projects.forEach((project, i) => {
        project.classList.toggle('active', i === currentProject);
    });
}

projects.forEach((project, index) => {
    project.addEventListener('mouseenter', () => {
        selectProject(index);
    });
});

prevButton.addEventListener('click', () => {
    selectProject(currentProject - 1);
});

nextButton.addEventListener('click', () => {
    selectProject(currentProject + 1);
});

document.addEventListener('click', (event) => {
    const clickedProject = event.target.closest('.work-rectangle');
    const clickedControls = event.target.closest('.works-controls');

    if (!clickedProject && !clickedControls) {
        projects.forEach((project) => {
            project.classList.remove('active');
        });
    }
});


