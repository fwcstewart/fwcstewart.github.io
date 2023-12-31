document.addEventListener('DOMContentLoaded', () => {
    const numbleLink = document.getElementById('numble-link');
    const rpsLink = document.getElementById('rps-link');

    // Implement any JavaScript interactions or effects you want to apply to the links
    numbleLink.addEventListener('click', (event) => {
        // You can add logic before redirecting or animate the transition
        console.log('Numble was clicked');
    });

    rpsLink.addEventListener('click', (event) => {
        // Similar logic for Rock Paper Scissors
        console.log('Rock Paper Scissors was clicked');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.classList.add('bounce');
            setTimeout(() => event.target.classList.remove('bounce'), 1000);
        });
    });
});

