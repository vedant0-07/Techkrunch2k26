/**
 * TechKrunch | PRAGYOTSAV 2K26 
 * Final Refined Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 50
    });

    // 2. Countdown Timer Logic
    const countdown = () => {
        const countDate = new Date("March 24, 2026 00:00:00").getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const timerElement = document.getElementById("timer");
        if (!timerElement) return;

        if (gap > 0) {
            const d = Math.floor(gap / day);
            const h = Math.floor((gap % day) / hour);
            const m = Math.floor((gap % hour) / minute);
            const s = Math.floor((gap % minute) / second);

            timerElement.innerHTML = `
                <div class="timer-box">
                    ${d}<br><span>Days</span>
                </div>
                <div class="timer-box">
                    ${h}<br><span>Hours</span>
                </div>
                <div class="timer-box">
                    ${m}<br><span>Mins</span>
                </div>
                <div class="timer-box">
                    ${s}<br><span>Secs</span>
                </div>
            `;
        } else {
            timerElement.innerHTML = `<h2 class="stranger-title text-4xl">THE PORTAL IS OPEN</h2>`;
        }
    };

    setInterval(countdown, 1000);
    countdown();

    // 3. Performance-Optimized Parallax & Navbar
    const nav = document.querySelector('nav');
    const monster = document.getElementById('layerMonster');
    const bikes = document.getElementById('layerBikes');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar Transition
        if (nav) {
            if (scrollPos > 50) {
                nav.classList.replace('bg-black/90', 'bg-black');
                nav.style.borderBottomColor = 'rgba(255, 0, 0, 0.5)';
            } else {
                nav.classList.replace('bg-black', 'bg-black/90');
                nav.style.borderBottomColor = 'rgba(255, 0, 0, 0.1)';
            }
        }

        // Parallax Layers (Using requestAnimationFrame for smoothness)
        window.requestAnimationFrame(() => {
            if (monster) {
                monster.style.transform = `translateY(${scrollPos * 0.15}px)`;
            }
            if (bikes) {
                bikes.style.transform = `translateY(${scrollPos * 0.25}px)`;
            }
        });
    });
});