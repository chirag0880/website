// Initialize Lenis for buttery smooth scrolling
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, 
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
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

// Navbar styling on scroll
const navbar = document.querySelector('.navbar');
lenis.on('scroll', (e) => {
    if (e.animatedScroll > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggleBtn.querySelector('i');

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initial Hero load sequence
    const tl = gsap.timeline();
    
    tl.fromTo('.navbar', {y: -50, opacity: 0}, {y: 0, opacity: 1, duration: 1, ease: 'power3.out'})
      .fromTo('.hero-content h1', {y: 100, opacity: 0}, {y: 0, opacity: 1, duration: 1.2, ease: 'power4.out'}, "-=0.5")
      .fromTo('.hero-content p', {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 1, ease: 'power3.out'}, "-=0.8")
      .fromTo('.hero-content .btn-group', {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 1}, "-=0.8")
      .fromTo('.terminal-mockup', {scale: 0.9, opacity: 0, y: 50}, {scale: 1, opacity: 1, y: 0, duration: 1.5, ease: 'power3.out'}, "-=1")
      .fromTo('#control-plane .bg-text', {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 2, ease: 'power2.out'}, "-=1.5");

    // 2. Typing effect in Terminal - trigger when visible
    ScrollTrigger.create({
        trigger: ".terminal-body",
        start: "top 80%",
        onEnter: () => {
            const lines = document.querySelectorAll('.terminal-body .output');
            gsap.fromTo(lines, 
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.1, stagger: 0.2 }
            );
        },
        once: true
    });

    // 3. Module Scroll Animations (Pinning logic like Jesko Jets)
    
    // Parallax background text
    gsap.utils.toArray('.bg-text').forEach(text => {
        const speed = text.getAttribute('data-speed') || 0.8;
        gsap.to(text, {
            y: () => (1 - speed) * ScrollTrigger.maxScroll(window),
            ease: "none",
            scrollTrigger: {
                trigger: text.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Parallax visuals
    gsap.utils.toArray('.parallax-element').forEach(el => {
        const speed = el.getAttribute('data-speed') || 1.1;
        gsap.fromTo(el, 
            { y: 50 },
            {
                y: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: el.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    // Module Fade-ups
    gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Split text reveals
    gsap.utils.toArray('.split-text').forEach(h2 => {
        gsap.fromTo(h2, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: h2, start: "top 85%", toggleActions: "play none none reverse" } }
        );
    });

    // 4. Node Grid Animation
    ScrollTrigger.create({
        trigger: "#infrastructure",
        start: "top 60%",
        onEnter: () => {
            const nodes = document.querySelectorAll('.node-item.active');
            // We animate CSS variables or simply rely on a CSS class + transition, 
            // but since we want GSAP pop effect, we'll animate properties that work in both modes
            gsap.fromTo(nodes, 
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
            );
        }
    });

    // 5. Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2.5,
                    ease: 'power3.out',
                    onUpdate: () => {
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
    // 6. Skills Filtering & Show More
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const showMoreBtn = document.getElementById('show-more-skills');
    let isShowingAll = false;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Animate cards out and then in
            gsap.to(skillCards, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                stagger: 0.02,
                onComplete: () => {
                    skillCards.forEach(card => {
                        const cardCategory = card.getAttribute('data-category');
                        const isExtra = card.classList.contains('extra-skill');
                        
                        // Filtering logic
                        if (filter === 'all') {
                            if (isExtra && !isShowingAll) {
                                card.classList.add('filtered-out');
                            } else {
                                card.classList.remove('filtered-out');
                            }
                        } else if (cardCategory === filter) {
                            card.classList.remove('filtered-out');
                        } else {
                            card.classList.add('filtered-out');
                        }
                    });

                    // Animate visible cards back in
                    const visibleCards = document.querySelectorAll('.skill-card:not(.filtered-out)');
                    gsap.fromTo(visibleCards, 
                        { opacity: 0, scale: 0.8, y: 20 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)" }
                    );
                }
            });
        });
    });

    showMoreBtn.addEventListener('click', () => {
        isShowingAll = !isShowingAll;
        const extraSkills = document.querySelectorAll('.extra-skill');
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        if (isShowingAll) {
            showMoreBtn.innerText = "Show Less";
            extraSkills.forEach(card => {
                card.classList.add('show');
                // Only show if it matches current filter
                if (activeFilter === 'all' || card.getAttribute('data-category') === activeFilter) {
                    card.classList.remove('filtered-out');
                }
            });
            
            // Animate only the new ones
            gsap.fromTo(extraSkills, 
                { opacity: 0, scale: 0.8, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
            );
        } else {
            showMoreBtn.innerText = "Show All Skills";
            extraSkills.forEach(card => {
                card.classList.remove('show');
                card.classList.add('filtered-out');
            });
        }
        
        // Refresh scroll trigger because page height changed
        ScrollTrigger.refresh();
    });

    // Initial Skill cards animation when scrolled into view
    ScrollTrigger.create({
        trigger: "#skills",
        start: "top 70%",
        onEnter: () => {
            const visibleCards = document.querySelectorAll('.skill-card:not(.filtered-out)');
            gsap.fromTo(visibleCards, 
                { opacity: 0, scale: 0.5, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }
            );
        },
        once: true
    });

});
