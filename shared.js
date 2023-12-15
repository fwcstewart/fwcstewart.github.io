document.addEventListener('DOMContentLoaded', function() {
        const burgerButton = document.querySelector('.burger-menu-button');
        const navElements = document.querySelector('.nav-elements');

        burgerButton.addEventListener('click', function() {
            this.classList.toggle('is-active');
            navElements.classList.toggle('is-active');
        });
    });
