
document.addEventListener("DOMContentLoaded", () => {
    const camera = document.getElementById("camera");
    const scene = document.getElementById("scene");

    if (!camera || !scene) return;

    const SCENE_WIDTH = 2560;
    const SCENE_HEIGHT = 986;

    const livelli = [
        {
            elemento: document.querySelector(".entry-large"),
            profondita: 0.20
        },
        {
            elemento: document.querySelector(".entry-medium"),
            profondita: 0.50
        },
        {
            elemento: document.querySelector(".entry-small"),
            profondita: 0.80
        }
    ];

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scale = 1;

    const movimentoMassimo = 4;
    const movimentoParallasse = 14;
    const zonaBordo = 4.35;
    const fluidita = 0.06;

    const isWorksPage = !!document.querySelector(".works-title-container");

    function aggiornaDimensioni() {
        const isMobile = window.matchMedia(
            "(max-width: 600px), (pointer: coarse)"
        ).matches;

        if (isWorksPage) {
            scale = 1;
        } else if (isMobile) {
            // Su telefono, usa la larghezza dello schermo
            // per evitare che la scena diventi minuscola.
            scale = window.innerWidth / SCENE_WIDTH;
        } else {
            // Mantiene il comportamento originale su desktop.
            scale = Math.min(
                window.innerWidth / SCENE_WIDTH,
                window.innerHeight / SCENE_HEIGHT
            );
        }
    }

    aggiornaDimensioni();

    window.addEventListener("resize", aggiornaDimensioni);
    window.addEventListener("orientationchange", aggiornaDimensioni);

    document.addEventListener("mousemove", (event) => {
        // Nessuna parallasse basata sul mouse sui dispositivi touch.
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        const intensitaX = Math.max(
            0,
            (Math.abs(x) - (1 - zonaBordo)) / zonaBordo
        );

        const intensitaY = Math.max(
            0,
            (Math.abs(y) - (1 - zonaBordo)) / zonaBordo
        );

        targetX = -Math.sign(x) * intensitaX * movimentoMassimo;
        targetY = -Math.sign(y) * intensitaY * movimentoMassimo;

        livelli.forEach(({ elemento, profondita }) => {
            if (!elemento) return;

            elemento.style.setProperty(
                "--parallax-target-x",
                -Math.sign(x) * intensitaX *
                    movimentoParallasse * profondita + "px"
            );

            elemento.style.setProperty(
                "--parallax-target-y",
                -Math.sign(y) * intensitaY *
                    movimentoParallasse * profondita + "px"
            );
        });
    });

    const posizioni = livelli.map(({ elemento }) => ({
        elemento,
        x: 0,
        y: 0
    }));

    function animate() {
        currentX += (targetX - currentX) * fluidita;
        currentY += (targetY - currentY) * fluidita;

        scene.style.transform =
            `translate(${currentX}px, ${currentY}px) scale(${scale})`;

        posizioni.forEach((posizione) => {
            if (!posizione.elemento) return;

            const leggiTarget = (nome) =>
                parseFloat(
                    posizione.elemento.style.getPropertyValue(nome)
                ) || 0;

            const targetParallasseX =
                leggiTarget("--parallax-target-x");

            const targetParallasseY =
                leggiTarget("--parallax-target-y");

            posizione.x +=
                (targetParallasseX - posizione.x) * fluidita;

            posizione.y +=
                (targetParallasseY - posizione.y) * fluidita;

            posizione.elemento.style.setProperty(
                "--parallax-x",
                posizione.x + "px"
            );

            posizione.elemento.style.setProperty(
                "--parallax-y",
                posizione.y + "px"
            );
        });

        requestAnimationFrame(animate);
    }

    animate();
});
