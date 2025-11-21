document.addEventListener("DOMContentLoaded", () => {
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    const fadeElements = document.querySelectorAll('.fade-in');

    fadeElements.forEach((el, index) => {
        setTimeout(() => {
             observer.observe(el);
        }, index * 100); 
    });
});