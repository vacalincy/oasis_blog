document.addEventListener("DOMContentLoaded", () => {
    // Set up the IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Slide enters the viewport — trigger the animation
                entry.target.classList.add('is-visible');
            } else {
                // Slide leaves the viewport — remove the class
                // so the animation replays when the user scrolls back
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.5 // Triggers when 50% of the slide is visible
    });

    // Select all slides and attach the observer to them
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => observer.observe(slide));
});