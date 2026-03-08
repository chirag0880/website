// Initialize Lenis for buttery smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, // Leave native scrolling for mobile devices
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// ============================================
// Interactions & Animations
// ============================================

// 1. Transparent to Solid Navbar on Scroll
const navbar = document.querySelector('.navbar');
lenis.on('scroll', (e) => {
    if (e.animatedScroll > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Wait for load to ensure fonts/layout are ready
window.addEventListener('load', () => {

    // 2. Initial Page Load Animations (Hero Section)
    const tl = gsap.timeline();

    tl.fromTo('.navbar', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
    )
    .fromTo('.hero h1', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
        "-=0.9" // Overlay animation timing
    )
    .fromTo('.hero p', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        "-=0.9"
    )
    .fromTo('.hero-buttons', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        "-=0.9"
    )
    .fromTo('.mockup-container', 
        { y: 60, opacity: 0, rotationX: 15 }, 
        { y: 0, opacity: 1, rotationX: 8, duration: 1.5, ease: 'power3.out' },
        "-=0.7"
    );

    // 3. Parallax Effect for Terminal Mockup
    gsap.to('.terminal', {
        yPercent: 15, // Move down slightly as you scroll down
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true    // Links animation to scroll position directly
        }
    });

    // 4. Scroll Reveal Animations for Sections
    // Select elements we want to reveal smoothly
    const revealElements = gsap.utils.toArray('.section-header, .card, .metric-item, .cta h2, .cta p, .cta .btn');
    
    revealElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 }, 
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%', // Triggers when top of element hits 85% down viewport
                    toggleActions: 'play none none reverse' // Animates in and reverses if scrolled back up
                }
            }
        );
    });

    // 5. Number Counters Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true, // Only animate once
            onEnter: () => {
                // GSAP can animate objects. We animate an object with a value property
                // and update the HTML on every frame.
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2.5,
                    ease: 'power3.out',
                    onUpdate: () => {
                        // Formatting: if float, show 2 decimals. Otherwise round.
                        if(target % 1 !== 0) {
                           counter.innerHTML = obj.val.toFixed(2);
                        } else {
                           counter.innerHTML = Math.ceil(obj.val);
                        }
                    }
                });
            }
        });
    });

});
