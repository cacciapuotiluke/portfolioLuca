
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("custom-cursor");

    if (!cursor) return;

    document.addEventListener("mousemove", (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    });

});
