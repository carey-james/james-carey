document.getElementById('lock').addEventListener('click', function() {
    const leftGate = document.querySelector('.left-gate');
    const rightGate = document.querySelector('.right-gate');
    const lock = document.getElementById('lock');
    const message = document.getElementById('message');
    const music = document.getElementById('background-music');

    // Slide gates
    leftGate.style.transform = 'translateX(-100%)';
    rightGate.style.transform = 'translateX(100%)';

    // Hide the lock
    lock.style.display = 'none';

    // Show the message
    message.style.display = 'block';

    // Play music
    music.play();

    // Fade in the message parts
    fadeInMessage();
});

function fadeInMessage() {
    const parts = document.querySelectorAll('.part');
    let delay = 0;

    parts.forEach((part, index) => {
        setTimeout(() => {
            part.style.opacity = 1; // Fade in
        }, delay);
        delay += 2000; // Adjust delay for each part (1.5 seconds)
    });
}