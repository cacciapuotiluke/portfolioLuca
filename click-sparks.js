
document.addEventListener("click", function (event) {
    // Verifica che il click venga rilevato
    console.log("Click rilevato!");

    // Ignora link e controlli interattivi
    if (event.target.closest(
        'a, button, input, textarea, select, label, [role="button"], [role="link"]'
    )) return;

    const colors = [
        "#ff595e", "#ffca3a", "#8ac926", "#1982c4",
        "#6a4c93", "#ff70a6", "#00f5d4", "#f15bb5"
    ];

    for (let i = 0; i < 12; i++) {
        const spark = document.createElement("div");

        Object.assign(spark.style, {
            position: "fixed",
            left: event.clientX + "px",
            top: event.clientY + "px",
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            pointerEvents: "none",
            zIndex: "2147483647"
        });

        document.body.appendChild(spark);

        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        spark.animate([
            {
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1
            },
            {
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 500,
            easing: "ease-out",
            fill: "forwards"
        }).onfinish = () => spark.remove();
    }
});
