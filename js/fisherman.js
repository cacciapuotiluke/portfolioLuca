
document.addEventListener("DOMContentLoaded", () => {
    const fisherman = document.querySelector("#fisherman img");
    const projects = document.querySelectorAll(".work-rectangle");

    const projectPage = document.getElementById("project-page");
    const projectPageTitle = document.getElementById("project-page-title");
    const projectPageVideo = document.getElementById("project-page-video");
    const projectPageDescription = document.getElementById("project-page-description");
    const closeProjectPage = document.getElementById("close-project-page");

    const prevProjectPageButton = document.getElementById("prev-project-page");
    const nextProjectPageButton = document.getElementById("next-project-page");

    if (!fisherman) return;

    // CONTENUTI DEI PROGETTI
    // youtubeId: inserisci l'ID del video YouTube, non l'URL completo.

    const projectContents = {
        "Hen on wheels": {
            description: "Short vertical animation loop I made for Instagram reels. The character and skateboard were animated in Harmony, while the background and the compositing were done in After Effects.",
            youtubeId: "ZTeQQEGAT-4"
        },
        "Adam's Animation Academy Exam": {
            description: "This is the final animation I did for the Advanced Animation course at Adam's Animation Academy. I used an already existing rig of Finn from Adventure Time, I drew the crown and the compass and then I used the rock's rig Adam gave me. The brief was to make the character enter the screen and then getting roadblocked by an obstacle; then eventually he had to give the obstacle his hat or any kind of prop. I did everything in Harmony except for the sound design, which was done by Tommaso Marchetto in Reaper.",
            youtubeId: "YAet9hl1GzY"
        },
        "Awesomeland Project": {
            description: "Awesomeland was a 5-day jam based on a concept by Filippo Magnani: a fictional Disneyland presented by its own fictional Walt Disney, Ralph Ziegler, in a documentary about the park. The jam took the form of a teaser showing behind-the-scenes footage from the documentary’s production. I animated Ralph Ziegler and his makeup artist, and created the storyboard and animatic for the entire short. The jam was created with Filippo Magnani, Tommaso Marchetto and Andrea Starace.",
            youtubeId: "TueEdPFLOPg"
        },
        "Cutout Works": {
            description: "Here are showed three cutout scenes done as exercises to practice the technique. The first, 'Gerudo Temple', is created in Harmony using a rig of Link by Fabio Gioffre. The other two are exercises briefed by Adam Oliver during the Advanced Animation course ad Adam's Animation Academy, animated in Harmony using rigs provided by Adam.",
            youtubeId: "VEhrjcDPD8Y"
        },
        "Rough It Down Final Exam": {
            description: "Final animation for the Rough It Down paperlass animation course by Underdogz.The brief was to stage, direct and animate a fight scene starting from a soundtrack provided by the teacher Simone di Rocco. The scene was animated in Harmony.",
            youtubeId: "jaJDqSUe5tc"
        },
        "Welcome to Lindenwood Lake": {
            description: "One minute short created during a 5-day jam with Filippo Magnani and Tommaso Marchetto, based on a concept by Tommaso Marchetto. I created the storyboard and animatic for the entire short, animated the scenes in collaboration with Tommaso Marchetto and composited the final result. The short was animated in Harmony and composited in After Effects.",
            youtubeId: "okKYDG9lFG0"
        },
        "All According to Plan": {
            description: "This is the graduation short I made with Filippo Magnani and Tommaso Marchetto. The clip above is an extract of the whole short, which is 8 minutes long. I created the storyboard and animatic, collaborated on the backgrounds, the animations and the compositing. The main intent of the short was to mix different techniques and styles together, with the goal to create a mixed media short full of personality and visual charm. Some of the techniques included paper cutout, CGI, paperless, claymation, pixillation and motion design.",
            youtubeId: "drkmc25mc14"
        },
        "Billy the Seed & the Bad Nuts": {
            description: "Short Stop-Motion film created during my second year at NABA with Giacomo Manzontti, Andrea Montani and Andrea Starace. It parodies the aesthetic of classic western movies, showcasing three different ways to kill nuts. I animated in paperless the peanut dying scene in Harmony and then collaborated on the stop motion animation of all the three scenes using Dragonframe.",
            youtubeId: "cK_U5ItRcHs"
        }
    };

    const idleFrames = [
        "assets/Pescatore/Fish_Idle/FishIdle01.png",
        "assets/Pescatore/Fish_Idle/FishIdle02.png",
        "assets/Pescatore/Fish_Idle/FishIdle03.png",
        "assets/Pescatore/Fish_Idle/FishIdle04.png"
    ];

    const projectFrames = [
        "assets/Pescatore/Fish_Project/FishProject01.png",
        "assets/Pescatore/Fish_Project/FishProject02.png",
        "assets/Pescatore/Fish_Project/FishProject03.png",
        "assets/Pescatore/Fish_Project/FishProject04.png",
        "assets/Pescatore/Fish_Project/FishProject05.png",
        "assets/Pescatore/Fish_Project/FishProject06.png"
    ];

    const scrollFrames = Array.from(
        { length: 130 },
        (_, index) =>
            `assets/Pescatore/Fish_Scroll/FishScroll${String(index + 1).padStart(2, "0")}.png`
    );

    const idleFrameDuration = 1000 / 8;
    const frameDuration = 1000 / 24;

    let animationId = null;
    let isScrollAnimating = false;
    let currentProjectIndex = -1;

    // Precarica tutti i frame del pescatore
    [...idleFrames, ...projectFrames, ...scrollFrames].forEach((src) => {
        const image = new Image();
        image.src = src;
    });

    function stopAnimation() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Animazione Idle continua
    function playIdle() {
        stopAnimation();

        const startTime = performance.now();

        function animate(timestamp) {
            const elapsed = timestamp - startTime;
            const frame =
                Math.floor(elapsed / idleFrameDuration) % idleFrames.length;

            fisherman.src = idleFrames[frame];
            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

    // Animazione Project normale
    function playProject() {
        if (isScrollAnimating) return;

        stopAnimation();

        const startTime = performance.now();
        let lastFrameTime = startTime;
        let currentFrame = 0;

        fisherman.src = projectFrames[0];

        function animate(timestamp) {
            if (timestamp - startTime >= 1050) {
                playIdle();
                return;
            }

            if (timestamp - lastFrameTime >= frameDuration) {
                currentFrame = (currentFrame + 1) % projectFrames.length;
                fisherman.src = projectFrames[currentFrame];
                lastFrameTime = timestamp;
            }

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

    // Animazione Project inversa
    function playProjectReverse() {
        if (isScrollAnimating) return;

        stopAnimation();

        const startTime = performance.now();
        let lastFrameTime = startTime;
        let currentFrame = projectFrames.length - 1;

        fisherman.src = projectFrames[currentFrame];

        function animate(timestamp) {
            if (timestamp - startTime >= 1250) {
                playIdle();
                return;
            }

            if (timestamp - lastFrameTime >= frameDuration) {
                currentFrame--;

                if (currentFrame < 0) {
                    currentFrame = projectFrames.length - 1;
                }

                fisherman.src = projectFrames[currentFrame];
                lastFrameTime = timestamp;
            }

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

    // FishScroll: riproduzione completa dal frame 01 al 130
    function playScroll() {
        if (isScrollAnimating || projectPage?.classList.contains("open")) return;

        isScrollAnimating = true;
        stopAnimation();

        let currentFrame = 0;
        let lastFrameTime = 0;

        fisherman.src = scrollFrames[0];

        function animate(timestamp) {
            if (lastFrameTime === 0) {
                lastFrameTime = timestamp;
            }

            if (timestamp - lastFrameTime >= frameDuration) {
                currentFrame++;
                lastFrameTime = timestamp;

                if (currentFrame >= scrollFrames.length) {
                    isScrollAnimating = false;
                    playIdle();
                    return;
                }

                fisherman.src = scrollFrames[currentFrame];
            }

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

        fisherman.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch") return;
        if (projectPage?.classList.contains("open")) return;

        playScroll();
    });

    // La rotella attiva FishScroll solo quando la sottopagina è chiusa
    document.addEventListener(
        "wheel",
        (event) => {
            if (projectPage?.classList.contains("open")) {
                return;
            }

            event.preventDefault();

            if (isScrollAnimating) return;

            playScroll();
        },
        { passive: false, capture: true }
    );

    // Crea l'anteprima YouTube.
    // Il player viene inizializzato soltanto quando si preme Play.
    function createVideoPreview(container, youtubeId, title) {
        container.replaceChildren();

        if (!youtubeId) {
            return;
        }

        const preview = document.createElement("button");
        preview.type = "button";
        preview.className = "youtube-preview";
        preview.setAttribute("aria-label", `Riproduci il video: ${title}`);

        const thumbnail = document.createElement("img");
        thumbnail.className = "youtube-thumbnail";
        thumbnail.src = `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
        thumbnail.alt = `Anteprima del video ${title}`;
        thumbnail.loading = "eager";

        // Se la miniatura standard non è disponibile,
        // prova quella di dimensioni ridotte.
        thumbnail.addEventListener("error", () => {
            if (!thumbnail.src.endsWith("/default.jpg")) {
                thumbnail.src = `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/default.jpg`;
            }
        }, { once: true });

        const playIcon = document.createElement("span");
        playIcon.className = "youtube-play-icon";
        playIcon.setAttribute("aria-hidden", "true");
        playIcon.textContent = "▶";

        preview.append(thumbnail, playIcon);
        container.appendChild(preview);

        preview.addEventListener("click", () => {
            const iframe = document.createElement("iframe");

            iframe.src =
                `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&playsinline=1`;
            iframe.title = `Video del progetto ${title}`;
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            container.replaceChildren(iframe);
        }, { once: true });
    }

    // Apertura della sottopagina e caricamento dei contenuti
    function openProjectPage(project) {
        if (!projectPage || !projectPageTitle) return;

        const titleElement = project.querySelector(".work-title");
        if (!titleElement) return;

        const title = titleElement.textContent.trim();

        const content = projectContents[title] || {
            description: "",
            youtubeId: ""
        };

        projectPageTitle.textContent = title;

        // Anteprima video YouTube con caricamento al clic
        if (projectPageVideo) {
            createVideoPreview(
                projectPageVideo,
                content.youtubeId,
                title
            );
        }

        // Descrizione
        if (projectPageDescription) {
            projectPageDescription.textContent = content.description;
        }

        projectPage.scrollTop = 0;
        projectPage.classList.add("open");
        projectPage.setAttribute("aria-hidden", "false");
    }

    // Navigazione tra le sottopagine
    function navigateProjectPage(direction) {
        if (!projectPage?.classList.contains("open") || projects.length === 0) {
            return;
        }

        currentProjectIndex =
            (currentProjectIndex + direction + projects.length) % projects.length;

        openProjectPage(projects[currentProjectIndex]);
    }

    if (prevProjectPageButton) {
        prevProjectPageButton.addEventListener("click", () => {
            navigateProjectPage(-1);
        });
    }

    if (nextProjectPageButton) {
        nextProjectPageButton.addEventListener("click", () => {
            navigateProjectPage(1);
        });
    }

    // Chiusura della sottopagina
    function closeProjectSubpage() {
        if (!projectPage) return;

        projectPage.classList.remove("open");
        projectPage.setAttribute("aria-hidden", "true");
    }

    // X: chiude la sottopagina e avvia FishProject
    if (closeProjectPage) {
        closeProjectPage.addEventListener("click", () => {
            if (isScrollAnimating) return;

            closeProjectSubpage();
            playProject();
        });
    }

    // Clic sui progetti della galleria
    projects.forEach((project, index) => {
        project.addEventListener("click", () => {
            if (isScrollAnimating) return;

            currentProjectIndex = index;

            playProjectReverse();
            openProjectPage(project);
        });
    });

    playIdle();
});
