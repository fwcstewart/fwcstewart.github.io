document.addEventListener('DOMContentLoaded', function() {
        const burgerButton = document.querySelector('.burger-menu-button');
        const navElements = document.querySelector('.nav-elements');

        burgerButton.addEventListener('click', function() {
            this.classList.toggle('is-active');
            navElements.classList.toggle('is-active');
        });
    });

document.addEventListener("DOMContentLoaded", function() {
    var navElement = document.querySelector('.nav-elements nav');

    var links = [
        { href: "https://numble-game.com", text: "Home" },
        { href: "https://numble-game.com/numble", text: "Numble" },
        { href: "https://numble-game.com/rps", text: "RPS" },
        { href: "https://numble-game.com/highlow", text: "Higher or Lower" },
        // Add more links as needed
    ];

    links.forEach(link => {
        var a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        a.className = 'nav-item';
        navElement.appendChild(a);
    });
});

