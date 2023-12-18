document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.classList.add('bounce');
            setTimeout(() => event.target.classList.remove('bounce'), 1000);
        });
    });
});

