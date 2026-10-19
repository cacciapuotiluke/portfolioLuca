
document.addEventListener("DOMContentLoaded", () => {
    const character = document.getElementById("character");
    const scene = document.getElementById("scene");
    const customCursor = document.getElementById("custom-cursor");

    if (!character || !scene) return;

    const SCENE_HEIGHT = 986;


    function checkCursorOverCharacter() {
        if (!customCursor || !character.isConnected) return;

        const cursorRect = customCursor.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();

        const isOver =
            cursorRect.left < characterRect.right &&
            cursorRect.right > characterRect.left &&
            cursorRect.top < characterRect.bottom &&
            cursorRect.bottom > characterRect.top;

        character.classList.toggle("cursor-over", isOver);

        requestAnimationFrame(checkCursorOverCharacter);
    }

    if (customCursor) {
        checkCursorOverCharacter();
    }

    let position = 0;
    let velocity = 0;
    let previousVelocity = 0;
    let lastWheelTime = 0;
    let lastFrame = performance.now();

    const maxOffset = 8000;
    const wheelForce = 0.185;
    const maxVelocity = 75;

    const limbs = [
        {
            selector: ".arm-left-upper",
            base: -58,
            side: -1,
            gravity: 0.85,
            inertia: 0.8
        },
        {
            selector: ".arm-right-upper",
            base: 61,
            side: 1,
            gravity: 0.85,
            inertia: 0.8
        },
        {
            selector: ".arm-left-lower",
            base: 0,
            side: 1,
            gravity: 0.95,
            inertia: 1.1
        },
        {
            selector: ".arm-right-lower",
            base: 0,
            side: -1,
            gravity: 0.95,
            inertia: 1.1
        },
        {
            selector: ".leg-left-upper",
            base: -41,
            side: -1,
            gravity: 0.65,
            inertia: 0.55
        },
        {
            selector: ".leg-right-upper",
            base: 46,
            side: 1,
            gravity: 0.65,
            inertia: 0.55
        },
        {
            selector: ".leg-left-lower",
            base: 0,
            side: 1,
            gravity: 0.8,
            inertia: 0.85
        },
        {
            selector: ".leg-right-lower",
            base: 0,
            side: -1,
            gravity: 0.8,
            inertia: 0.85
        }
    ].map(limb => ({
        ...limb,
        element: character.querySelector(limb.selector),
        angle: limb.base,
        angularVelocity: 0
    }));

    const heads = character.querySelectorAll(".head");

    let headAngle = 0;
    let headAngularVelocity = 0;

    window.addEventListener("wheel", event => {
        event.preventDefault();

        const oldVelocity = velocity;

        velocity += event.deltaY * wheelForce;
        velocity = Math.max(
            -maxVelocity,
            Math.min(maxVelocity, velocity)
        );

        const impulse = velocity - oldVelocity;

        headAngularVelocity += -impulse * 1.8;

        limbs.forEach(limb => {
            limb.angularVelocity +=
                impulse * limb.side * limb.inertia * 0.75;
        });

        lastWheelTime = performance.now();
        character.classList.add("is-moving");
    }, { passive: false });

    function animate(now) {
        const dt = Math.min((now - lastFrame) / 16.667, 2);
        lastFrame = now;

        velocity += -position * 0.025 * dt;
        velocity *= Math.pow(0.90, dt);
        position += velocity * dt;

        if (position > maxOffset) {
            position = maxOffset;
            velocity *= -0.35;
        } else if (position < -maxOffset) {
            position = -maxOffset;
            velocity *= -0.35;
        }

        const bodyAcceleration = velocity - previousVelocity;
        previousVelocity = velocity;

        limbs.forEach(limb => {
            if (!limb.element) return;

            const relativeAngle = limb.angle - limb.base;
            const radians = relativeAngle * Math.PI / 180;

            const gravityTorque =
                -Math.sin(radians) * limb.gravity;

            const inertiaTorque =
                bodyAcceleration * limb.side * limb.inertia;

            limb.angularVelocity +=
                (gravityTorque + inertiaTorque) * dt;

            limb.angularVelocity *= Math.pow(0.975, dt);
            limb.angle += limb.angularVelocity * dt;

            const deviation = limb.angle - limb.base;
            const maxAngle = limb.selector.includes("arm") ? 65 : 45;

            if (deviation > maxAngle) {
                limb.angle = limb.base + maxAngle;
                limb.angularVelocity *= -0.3;
            } else if (deviation < -maxAngle) {
                limb.angle = limb.base - maxAngle;
                limb.angularVelocity *= -0.3;
            }

            limb.element.style.transform =
                `rotate(${limb.angle}deg)`;
        });

        headAngularVelocity += -headAngle * 0.68 * dt;
        headAngularVelocity *= Math.pow(0.82, dt);
        headAngle += headAngularVelocity * dt;

        headAngle = Math.max(-12, Math.min(12, headAngle));

        heads.forEach(head => {
            head.style.transform = `rotate(${headAngle}deg)`;
        });

        // Posizione verticale espressa nelle coordinate della scena.
        
        character.style.setProperty(
            "--character-scroll-y",
            `${position}px`
        );

        character.style.transform = "translateY(-50%)";

        if (now - lastWheelTime > 1750) {
            character.classList.remove("is-moving");
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});
