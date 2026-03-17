/**
 * PRAGYOTSAV 2K26 — ALL 10 IDEAS ENGINE
 * 1. Glitch intro  2. Mouse-repulsion spores  3. Hawkins map
 * 4. Day→Night scroll scene  5. Morse typewriter  6. 3D tilt cards
 * 7. Ambient sound  8. Demogorgon mobile menu  9. Light progress bar
 * 10. Portal register ripple
 */

/* ═══════════════════════════════════════════
   IDEA 1 — VHS GLITCH INTRO
═══════════════════════════════════════════ */
(function glitchIntro() {
    const overlay  = document.getElementById('glitch-overlay');
    const gc       = document.getElementById('glitch-canvas');
    const gctx     = gc.getContext('2d');
    const gl1      = document.getElementById('gl1');
    const gl3      = document.getElementById('gl3');
    let frame = 0, done = false;

    function resizeGC() { gc.width = window.innerWidth; gc.height = window.innerHeight; }
    resizeGC();

    const bars = Array.from({length:12}, () => ({
        y: Math.random() * window.innerHeight,
        h: Math.random() * 6 + 2,
        x: (Math.random() - 0.5) * 40,
        speed: Math.random() * 4 + 1,
        alpha: Math.random() * 0.6 + 0.2
    }));

    function drawGlitch() {
        if (done) return;
        frame++;
        gctx.clearRect(0, 0, gc.width, gc.height);

        // Scan lines
        for (let y = 0; y < gc.height; y += 3) {
            gctx.fillStyle = `rgba(0,0,0,${0.12 + Math.random() * 0.06})`;
            gctx.fillRect(0, y, gc.width, 1);
        }

        // Glitch horizontal bars
        bars.forEach(b => {
            b.y += b.speed;
            if (b.y > gc.height) b.y = -b.h;
            gctx.fillStyle = `rgba(${180 + Math.random()*40},${Math.random()*20},${Math.random()*15},${b.alpha})`;
            gctx.fillRect(b.x, b.y, gc.width * (0.3 + Math.random() * 0.7), b.h);
        });

        // RGB shift lines
        if (Math.random() > 0.6) {
            const ry = Math.random() * gc.height;
            gctx.fillStyle = 'rgba(255,0,0,0.08)';
            gctx.fillRect(-8, ry, gc.width, 2);
            gctx.fillStyle = 'rgba(0,0,255,0.08)';
            gctx.fillRect(8, ry + 1, gc.width, 2);
        }

        // Random noise patches
        for (let i = 0; i < 6; i++) {
            const nx = Math.random() * gc.width, ny = Math.random() * gc.height;
            const nw = Math.random() * 120 + 20, nh = Math.random() * 4 + 1;
            gctx.fillStyle = `rgba(200,20,0,${Math.random() * 0.15})`;
            gctx.fillRect(nx, ny, nw, nh);
        }

        // Progress bar update
        const pct = Math.min(frame / 90, 1);
        const blocks = Math.floor(pct * 12);
        gl3.textContent = '■'.repeat(blocks) + '░'.repeat(12 - blocks) + ` ${Math.floor(pct*100)}%`;

        // Glitch text shake
        if (frame % 8 === 0) gl1.classList.toggle('gl-glitch');

        requestAnimationFrame(drawGlitch);
    }
    drawGlitch();

    // End after 2.4s
    setTimeout(() => {
        done = true;
        overlay.classList.add('fade-out');
        document.body.classList.remove('loading');
        setTimeout(() => { overlay.style.display = 'none'; }, 700);
        // Trigger hero entrance after glitch
        triggerHeroEntrance();
    }, 2400);
})();

/* ═══════════════════════════════════════════
   HERO ENTRANCE (post-glitch)
═══════════════════════════════════════════ */
function triggerHeroEntrance() {
    AOS.init({ duration:1000, once:false, mirror:true, offset:60, easing:'ease-out-cubic' });
    startMorseTypewriter();
}

/* ═══════════════════════════════════════════
   IDEA 5 — MORSE TYPEWRITER TAGLINE
═══════════════════════════════════════════ */
function startMorseTypewriter() {
    const el = document.getElementById('hero-tagline');
    if (!el) return;
    const finalText = '"Enter the Upside Down of Technology"';
    const morse = {
        'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---',
        'K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-',
        'U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',' ':' ','0':'-----','1':'.----',
        '2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
        '"':"'", "'":'.----.'
    };

    function toMorse(str) {
        return str.toUpperCase().split('').map(c => morse[c] || c).join(' ');
    }

    const morseStr = toMorse(finalText);
    let i = 0;

    // Phase 1: type morse code
    function typeMorse() {
        if (i <= morseStr.length) {
            el.innerHTML = `<span style="opacity:0.55;letter-spacing:0.15em">${morseStr.slice(0,i)}</span><span class="cursor-blink"></span>`;
            i++;
            setTimeout(typeMorse, 22);
        } else {
            // Phase 2: "decode" — replace with actual text
            setTimeout(() => decodeMorse(), 400);
        }
    }

    // Phase 2: scramble → resolve into real text
    function decodeMorse() {
        const chars = '.-_ ';
        let iterations = 0;
        const maxIter = 18;
        const interval = setInterval(() => {
            const revealed = Math.floor((iterations / maxIter) * finalText.length);
            let display = '';
            for (let j = 0; j < finalText.length; j++) {
                if (j < revealed) {
                    display += finalText[j];
                } else {
                    display += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            el.innerHTML = `${display}<span class="cursor-blink"></span>`;
            iterations++;
            if (iterations >= maxIter) {
                clearInterval(interval);
                el.innerHTML = `${finalText}<span class="cursor-blink"></span>`;
                // Remove cursor after 2s
                setTimeout(() => { el.textContent = finalText; }, 2000);
            }
        }, 80);
    }

    setTimeout(typeMorse, 800);
}

/* ═══════════════════════════════════════════
   IDEA 9 — CHRISTMAS LIGHT PROGRESS BAR
═══════════════════════════════════════════ */
(function initProgressLights() {
    const container = document.getElementById('light-bulbs');
    if (!container) return;
    const colors = ['pb-r','pb-y','pb-g','pb-b','pb-p'];
    const COUNT = Math.ceil(window.innerWidth / 20);

    for (let i = 0; i < COUNT; i++) {
        const b = document.createElement('div');
        b.className = `prog-bulb ${colors[i % colors.length]}`;
        container.appendChild(b);
    }
    container.style.transform = 'translateX(0)';

    const bulbs = container.querySelectorAll('.prog-bulb');

    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const litCount = Math.round(pct * bulbs.length);
        bulbs.forEach((b, i) => {
            b.classList.toggle('lit', i < litCount);
        });
    }, { passive: true });
})();

/* ═══════════════════════════════════════════
   IDEA 4 — CINEMATIC SCENE CANVAS (Day→Night on scroll)
═══════════════════════════════════════════ */
const sceneCanvas = document.getElementById('scene-canvas');
const sc = sceneCanvas.getContext('2d');
let W, H, scrollY = 0, scrollVel = 0, lastSY = 0;

function resizeScene() { W = sceneCanvas.width = window.innerWidth; H = sceneCanvas.height = window.innerHeight; }
resizeScene();
window.addEventListener('resize', resizeScene, { passive: true });

// Color lerp helper
function lerpColor(a, b, t) {
    return [
        a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t,
        a[2] + (b[2]-a[2])*t, (a[3]||1) + ((b[3]||1)-(a[3]||1))*t
    ];
}
function rgba(c, a) { return `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a !== undefined ? a : (c[3]||1)})`; }

let sceneT = 0, lightningTimer = 180, lightningAlpha = 0;

function drawScene() {
    sceneT++;
    sc.clearRect(0, 0, W, H);

    // Scroll 0=day dusk, 1=full upside down night
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const t = Math.min(scrollY / (maxScroll * 0.4), 1); // transition in first 40% of scroll

    drawSkyAtmosphere(t);
    drawMoon(t);
    drawForest(t);
    drawGround(t);
    drawRoad(t);
    drawDemogorgon(t);
    drawRiders(t);

    requestAnimationFrame(drawScene);
}
drawScene();

function drawSkyAtmosphere(t) {
    // Lightning flickers intensify as t increases
    lightningTimer--;
    if (lightningTimer <= 0) {
        lightningAlpha = (0.03 + Math.random() * 0.05) * (1 + t * 2);
        lightningTimer = Math.random() * (300 - t * 200) + 60;
    }
    lightningAlpha *= 0.92;
    if (lightningAlpha > 0.005) {
        const lg = sc.createRadialGradient(W * 0.7, H * 0.1, 0, W * 0.7, H * 0.1, W * 0.4);
        lg.addColorStop(0, `rgba(180,60,20,${lightningAlpha})`);
        lg.addColorStop(1, 'transparent');
        sc.fillStyle = lg; sc.fillRect(0, 0, W, H * 0.6);
    }

    // Aurora bands — grow with t
    for (let i = 0; i < 3; i++) {
        const ay = H * (0.55 + i * 0.04) + Math.sin(sceneT * 0.0003 + i * 1.5) * 8;
        const ag = sc.createLinearGradient(0, ay - 12, 0, ay + 12);
        ag.addColorStop(0, 'transparent');
        ag.addColorStop(0.5, `rgba(${60 + t*40},0,${5 + t*15},${(0.06 + t * 0.08) - i * 0.015})`);
        ag.addColorStop(1, 'transparent');
        sc.fillStyle = ag; sc.fillRect(0, ay - 12, W, 24);
    }
}

function drawMoon(t) {
    const mx = W * 0.72, my = H * (0.22 - t * 0.04) + Math.sin(sceneT * 0.0004) * 3;
    const mr = W < 600 ? 42 : 60;
    const glowStr = 0.15 + t * 0.25;

    for (let i = 4; i >= 1; i--) {
        const g = sc.createRadialGradient(mx, my, mr * 0.8, mx, my, mr + i * 20);
        g.addColorStop(0, `rgba(${60 + t*40},0,${5 + t*10},${(0.07 / i) * (1 + t)})`);
        g.addColorStop(1, 'transparent');
        sc.beginPath(); sc.arc(mx, my, mr + i * 20, 0, Math.PI*2);
        sc.fillStyle = g; sc.fill();
    }
    const moonGrad = sc.createRadialGradient(mx - mr*.3, my - mr*.3, mr*.05, mx, my, mr);
    moonGrad.addColorStop(0, `rgb(${42 + t*20},${8 - t*3},${8 - t*3})`);
    moonGrad.addColorStop(0.5, `rgb(${26 - t*5},${3},${5})`);
    moonGrad.addColorStop(1, `rgb(${13},${1},${8 - t*4})`);
    sc.beginPath(); sc.arc(mx, my, mr, 0, Math.PI*2);
    sc.fillStyle = moonGrad; sc.fill();
    sc.beginPath(); sc.arc(mx, my, mr, 0, Math.PI*2);
    sc.strokeStyle = `rgba(${180 + t*20},${20 - t*10},${10},${0.25 + t*0.2})`; sc.lineWidth = 1.5; sc.stroke();
}

function drawForest(t) {
    const groundY = H * 0.78;
    const sway = Math.sin(sceneT * (0.0006 + t * 0.0004)) * (1.2 + t * 1.5);
    // Colors shift from muted green-grey at t=0 to dead black at t=1
    const c3 = `rgba(${8 + t*0},${2 + (1-t)*4},${4},${0.65 + t*0.3})`;
    const c2 = `rgba(${5 + t*0},${1 + (1-t)*2},${3},${0.82 + t*0.15})`;
    const c1 = `rgba(${2},${0},${2},${0.97})`;
    drawTreeLayer(groundY + 30, 0.55, c3, 18, 1.0, 0, sway * 0.3);
    drawTreeLayer(groundY + 12, 0.75, c2, 14, 1.3, 7, sway * 0.6);
    drawTreeLayer(groundY,      1.0,  c1, 11, 1.7, 17, sway);
}

function drawTreeLayer(baseY, scale, color, count, hm, seed, sway) {
    sc.fillStyle = color;
    sc.beginPath(); sc.moveTo(0, baseY);
    const spacing = W / count;
    for (let i = 0; i <= count; i++) {
        const x = i * spacing + (((seed*37 + i*97) % 100)/100 - 0.5) * spacing * 0.4;
        const tH = (60 + ((seed*53 + i*71) % 80)) * scale * hm;
        const tW = (18 + ((seed*29 + i*43) % 28)) * scale;
        drawTree(x + sway, baseY, tH, tW);
    }
    sc.lineTo(W, baseY); sc.closePath(); sc.fill();
}

function drawTree(x, baseY, h, w) {
    sc.moveTo(x, baseY);
    sc.lineTo(x - w*.5, baseY); sc.lineTo(x - w*.3, baseY - h*.35);
    sc.lineTo(x - w*.45, baseY - h*.35); sc.lineTo(x - w*.22, baseY - h*.62);
    sc.lineTo(x - w*.35, baseY - h*.62); sc.lineTo(x - w*.1, baseY - h*.82);
    sc.lineTo(x, baseY - h);
    sc.lineTo(x + w*.1, baseY - h*.82); sc.lineTo(x + w*.35, baseY - h*.62);
    sc.lineTo(x + w*.22, baseY - h*.62); sc.lineTo(x + w*.45, baseY - h*.35);
    sc.lineTo(x + w*.3, baseY - h*.35); sc.lineTo(x + w*.5, baseY);
}

function drawGround(t) {
    const gy = H * 0.78;
    const g = sc.createLinearGradient(0, gy, 0, H);
    g.addColorStop(0, `rgba(${3 + t*2},0,${2 + t*3},0.98)`);
    g.addColorStop(1, `rgba(2,0,1,1)`);
    sc.fillStyle = g; sc.fillRect(0, gy, W, H - gy);
    for (let i = 0; i < 3; i++) {
        const gm = sc.createRadialGradient(W*(0.2+i*.3) + Math.sin(sceneT*.0003+i)*18, gy+5, 0, W*(0.2+i*.3), gy+5, W*.22);
        gm.addColorStop(0, `rgba(${60 + t*30},0,${5 + t*10},${0.06 + t*0.04})`);
        gm.addColorStop(1, 'transparent');
        sc.beginPath(); sc.ellipse(W*(0.2+i*.3) + Math.sin(sceneT*.0003+i)*18, gy+8, W*.22, 32, 0, 0, Math.PI*2);
        sc.fillStyle = gm; sc.fill();
    }
}

function drawRoad(t) {
    const ry = H * 0.82;
    const g = sc.createLinearGradient(0, ry, 0, H);
    g.addColorStop(0, `rgba(${6 + t*4},${3},${4 + t*4},0.9)`);
    g.addColorStop(1, `rgba(4,2,3,0.95)`);
    sc.fillStyle = g;
    sc.beginPath(); sc.moveTo(0, ry); sc.lineTo(W, ry); sc.lineTo(W, H); sc.lineTo(0, H); sc.closePath(); sc.fill();
    sc.setLineDash([30, 25]);
    sc.strokeStyle = `rgba(${80 + t*20},${40},${40 + t*20},${0.18 + t*0.1})`; sc.lineWidth = 2;
    sc.beginPath(); sc.moveTo(0, H*.875); sc.lineTo(W, H*.875); sc.stroke(); sc.setLineDash([]);
}

let demoPhase = 0;
function drawDemogorgon(t) {
    if (t < 0.05) return; // only show when scrolled a bit
    demoPhase += 0.0008;
    const bob = Math.sin(demoPhase) * 8;
    const rise = t; // rises from 0 to full height as t increases
    const s = (W < 600 ? 0.55 : 0.9) * Math.min(rise * 3, 1);
    const dx = W * 0.14;
    const dy = H * (0.58 + (1-rise) * 0.25) + bob;
    const alpha = Math.min(rise * 3, 1) * (0.25 + Math.sin(demoPhase * 1.5) * 0.05);

    sc.save(); sc.translate(dx, dy); sc.scale(s, s); sc.globalAlpha = alpha;
    const aura = sc.createRadialGradient(0, -30, 10, 0, -30, 100);
    aura.addColorStop(0, `rgba(${80 + t*40},0,${5 + t*15},0.18)`); aura.addColorStop(1, 'transparent');
    sc.fillStyle = aura; sc.beginPath(); sc.arc(0, -30, 100, 0, Math.PI*2); sc.fill();
    sc.fillStyle = 'rgba(4,0,2,0.88)';
    sc.beginPath(); sc.ellipse(0, 0, 38, 55, 0, 0, Math.PI*2); sc.fill();
    sc.beginPath(); sc.arc(0, -60, 34, 0, Math.PI*2); sc.fill();
    for (let p = 0; p < 6; p++) {
        const angle = (p/6)*Math.PI*2 - Math.PI/2;
        sc.beginPath(); sc.ellipse(Math.cos(angle)*28, -60+Math.sin(angle)*28, 14, 22, angle, 0, Math.PI*2); sc.fill();
    }
    const v = sc.createRadialGradient(0, -60, 0, 0, -60, 26);
    v.addColorStop(0, 'rgba(0,0,0,0.9)'); v.addColorStop(1, 'transparent');
    sc.fillStyle = v; sc.beginPath(); sc.arc(0, -60, 26, 0, Math.PI*2); sc.fill();
    sc.fillStyle = 'rgba(4,0,2,0.88)';
    [[-1,-0.3],[1,-0.3],[-1.3,0],[1.3,0]].forEach(([ax, ay]) => {
        const sw = Math.sin(demoPhase + ax) * 6;
        sc.beginPath();
        sc.moveTo(ax*32, ay*30);
        sc.bezierCurveTo(ax*60+sw, ay*30-30, ax*90+sw*2, 20+sw, ax*110+sw*3, 40+sw*2);
        sc.lineTo(ax*105, 44);
        sc.bezierCurveTo(ax*80, 22, ax*55, -28, ax*28, ay*30);
        sc.closePath(); sc.fill();
    });
    sc.restore();
}

function drawRiders(t) {
    const roadY = H * 0.836;
    // 3 main riders
    [[0.28, 1.15, 0], [0.44, 1.1, 0.8], [0.58, 1.2, 1.6]].forEach(([xp, s, ph]) => {
        const bob = Math.sin(sceneT * 0.08 + ph) * 1.5;
        const x = W * xp;
        drawBikeRider(x, roadY + bob, s, 0.92 - t * 0.08);
        if (xp === 0.28) drawFlashlight(x + 22*s, roadY - 28*s + bob);
    });
    // Far riders
    [[0.65, 0.55, 0.5], [0.72, 0.48, 0.38]].forEach(([xp, s, a]) => {
        drawBikeRider(W * xp, roadY, s, a * (1 - t * 0.3));
    });
}

function drawBikeRider(x, y, scale, alpha) {
    sc.save(); sc.translate(x, y); sc.scale(scale, scale); sc.globalAlpha = alpha;
    sc.lineWidth = 3.5; sc.strokeStyle = 'rgba(0,0,0,0.95)';
    sc.beginPath(); sc.arc(-28, 14, 20, 0, Math.PI*2); sc.stroke();
    sc.beginPath(); sc.arc(28, 14, 20, 0, Math.PI*2); sc.stroke();
    for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
        sc.lineWidth = 0.8;
        sc.beginPath(); sc.moveTo(-28+Math.cos(a)*5, 14+Math.sin(a)*5); sc.lineTo(-28+Math.cos(a)*19, 14+Math.sin(a)*19); sc.stroke();
        sc.beginPath(); sc.moveTo(28+Math.cos(a)*5, 14+Math.sin(a)*5); sc.lineTo(28+Math.cos(a)*19, 14+Math.sin(a)*19); sc.stroke();
    }
    sc.lineWidth = 3.5;
    sc.beginPath(); sc.moveTo(-28,14); sc.lineTo(2,-8); sc.stroke();
    sc.beginPath(); sc.moveTo(-28,14); sc.lineTo(2,14); sc.lineTo(28,14); sc.stroke();
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(28,14); sc.stroke();
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(2,14); sc.stroke();
    sc.beginPath(); sc.moveTo(18,-6); sc.lineTo(28,14); sc.stroke();
    sc.lineWidth = 2.5;
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(18,-8); sc.stroke();
    sc.beginPath(); sc.moveTo(18,-8); sc.lineTo(22,-8); sc.stroke();
    sc.beginPath(); sc.moveTo(22,-8); sc.lineTo(22,-14); sc.stroke();
    sc.beginPath(); sc.moveTo(20,-14); sc.lineTo(24,-14); sc.stroke();
    sc.lineWidth = 2;
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(2,-16); sc.stroke();
    sc.beginPath(); sc.moveTo(-4,-16); sc.lineTo(8,-16); sc.stroke();
    sc.fillStyle = 'rgba(0,0,0,0.95)';
    sc.beginPath(); sc.moveTo(0,-16); sc.lineTo(14,-26); sc.lineTo(16,-22); sc.lineTo(4,-12); sc.closePath(); sc.fill();
    sc.beginPath(); sc.arc(16,-30,7,0,Math.PI*2); sc.fill();
    sc.beginPath(); sc.arc(7,-22,5.5,0,Math.PI*2); sc.fill();
    sc.lineWidth = 4; sc.strokeStyle = 'rgba(0,0,0,0.95)';
    sc.beginPath(); sc.moveTo(14,-26); sc.lineTo(22,-14); sc.stroke();
    sc.lineWidth = 3.5;
    sc.beginPath(); sc.moveTo(2,-12); sc.lineTo(-8,2); sc.stroke();
    sc.beginPath(); sc.moveTo(-8,2); sc.lineTo(-6,14); sc.stroke();
    sc.beginPath(); sc.moveTo(2,-12); sc.lineTo(10,4); sc.stroke();
    sc.beginPath(); sc.moveTo(10,4); sc.lineTo(8,14); sc.stroke();
    sc.restore();
}

function drawFlashlight(x, y) {
    sc.save(); sc.translate(x, y);
    const fg = sc.createRadialGradient(0,0,0,0,0,260);
    fg.addColorStop(0, 'rgba(255,230,200,0.1)');
    fg.addColorStop(0.4, 'rgba(255,210,180,0.04)');
    fg.addColorStop(1, 'transparent');
    sc.fillStyle = fg;
    sc.beginPath(); sc.moveTo(0,0); sc.arc(0,0,260,-0.2,0.2); sc.closePath(); sc.fill();
    sc.restore();
}

/* ═══════════════════════════════════════════
   IDEA 3 — HAWKINS MAP CANVAS
═══════════════════════════════════════════ */
(function initHawkinsMap() {
    const mc = document.getElementById('map-canvas');
    if (!mc) return;
    const mctx = mc.getContext('2d');

    function drawMap() {
        const mw = mc.offsetWidth, mh = mc.offsetHeight;
        mc.width = mw; mc.height = mh;

        // Background — aged paper / upside down
        const bg = mctx.createLinearGradient(0, 0, mw, mh);
        bg.addColorStop(0, '#070305');
        bg.addColorStop(0.5, '#0a0408');
        bg.addColorStop(1, '#060204');
        mctx.fillStyle = bg; mctx.fillRect(0, 0, mw, mh);

        // Grid lines (faint)
        mctx.strokeStyle = 'rgba(200,30,0,0.04)'; mctx.lineWidth = 1;
        for (let x = 0; x < mw; x += 60) { mctx.beginPath(); mctx.moveTo(x,0); mctx.lineTo(x,mh); mctx.stroke(); }
        for (let y = 0; y < mh; y += 60) { mctx.beginPath(); mctx.moveTo(0,y); mctx.lineTo(mw,y); mctx.stroke(); }

        // Roads — hand-drawn style
        mctx.strokeStyle = 'rgba(100,60,40,0.35)'; mctx.lineWidth = 2; mctx.setLineDash([8,6]);
        const roads = [
            [[0.1*mw,0.5*mh],[0.35*mw,0.45*mh],[0.6*mw,0.5*mh],[0.9*mw,0.48*mh]],
            [[0.5*mw,0.1*mh],[0.48*mw,0.35*mh],[0.52*mw,0.6*mh],[0.5*mw,0.9*mh]],
            [[0.15*mw,0.2*mh],[0.4*mw,0.3*mh],[0.7*mw,0.25*mh]],
            [[0.2*mw,0.7*mh],[0.45*mw,0.75*mh],[0.7*mw,0.8*mh],[0.85*mw,0.72*mh]],
        ];
        roads.forEach(pts => {
            mctx.beginPath(); mctx.moveTo(pts[0][0], pts[0][1]);
            pts.slice(1).forEach(p => mctx.lineTo(p[0],p[1])); mctx.stroke();
        });
        mctx.setLineDash([]);

        // Forest patches
        mctx.fillStyle = 'rgba(10,20,8,0.4)';
        [[0.08,0.25,60,40],[0.82,0.15,50,35],[0.15,0.75,45,30],[0.78,0.82,55,38],[0.45,0.85,50,28]].forEach(([x,y,w,h]) => {
            mctx.beginPath(); mctx.ellipse(x*mw,y*mh,w,h,0,0,Math.PI*2); mctx.fill();
        });

        // Red string connections (conspiracy board style)
        const pins = [{x:0.22,y:0.38},{x:0.55,y:0.22},{x:0.75,y:0.55},{x:0.40,y:0.65},{x:0.18,y:0.68},{x:0.62,y:0.78}];
        mctx.strokeStyle = 'rgba(180,20,0,0.25)'; mctx.lineWidth = 1; mctx.setLineDash([3,4]);
        for (let i = 0; i < pins.length; i++) {
            for (let j = i+1; j < pins.length; j++) {
                if (Math.random() > 0.45) {
                    mctx.beginPath();
                    mctx.moveTo(pins[i].x*mw, pins[i].y*mh);
                    // Slightly curved string
                    const cx = (pins[i].x+pins[j].x)/2*mw + (Math.random()-0.5)*30;
                    const cy = (pins[i].y+pins[j].y)/2*mh + (Math.random()-0.5)*20;
                    mctx.quadraticCurveTo(cx, cy, pins[j].x*mw, pins[j].y*mh);
                    mctx.stroke();
                }
            }
        }
        mctx.setLineDash([]);

        // Map label
        mctx.font = `italic 11px 'Share Tech Mono', monospace`;
        mctx.fillStyle = 'rgba(180,100,60,0.2)';
        mctx.fillText('HAWKINS, INDIANA', 12, mh-12);
        mctx.fillText('CLASSIFIED', mw-90, 18);
    }

    drawMap();
    window.addEventListener('resize', drawMap, { passive: true });
})();

/* ═══════════════════════════════════════════
   IDEA 2 — SPORE PARTICLES WITH MOUSE REPULSION
═══════════════════════════════════════════ */
(function initSpores() {
    const sporeCanvas = document.getElementById('spore-canvas');
    const sctx = sporeCanvas.getContext('2d');
    let sW = window.innerWidth, sH = window.innerHeight;
    sporeCanvas.width = sW; sporeCanvas.height = sH;

    let mouseX = sW/2, mouseY = sH/2;
    // Gyroscope fallback for mobile (Idea 2)
    let gyroX = 0, gyroY = 0;
    window.addEventListener('deviceorientation', e => {
        gyroX = (e.gamma || 0) / 30; // -1 to 1
        gyroY = (e.beta  || 0) / 45;
    }, { passive: true });

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

    const spores = Array.from({ length: 90 }, () => ({
        x: Math.random() * sW, y: Math.random() * sH,
        vx: (Math.random()-0.5)*0.15, vy: -(Math.random()*0.3+0.07),
        r: Math.random()*1.5+0.3,
        op: Math.random()*0.4+0.08,
        phase: Math.random()*Math.PI*2,
        hue: ['rgba(170,30,220,','rgba(255,35,15,','rgba(240,180,60,','rgba(100,0,160,'][Math.floor(Math.random()*4)]
    }));

    function animSpores() {
        sctx.clearRect(0, 0, sW, sH);
        const boost = 1 + Math.abs(scrollVel) * 0.05;
        const REPEL_RADIUS = 120, REPEL_FORCE = 0.8;

        // Gyro repulsion center on mobile
        const repX = ('ontouchstart' in window) ? sW/2 + gyroX * sW * 0.3 : mouseX;
        const repY = ('ontouchstart' in window) ? sH/2 + gyroY * sH * 0.3 : mouseY;

        spores.forEach(s => {
            s.phase += 0.007;
            // Repulsion from cursor/gyro
            const dx = s.x - repX, dy = s.y - repY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < REPEL_RADIUS && dist > 0) {
                const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_FORCE;
                s.vx += (dx/dist) * force * 0.15;
                s.vy += (dy/dist) * force * 0.15;
            }
            // Dampen velocity
            s.vx *= 0.97; s.vy = s.vy * 0.97 - (0.05 + Math.random()*0.02) * boost;
            s.x += s.vx + Math.sin(s.phase)*0.1;
            s.y += s.vy;
            if (s.y < -5) { s.y = sH+5; s.x = Math.random()*sW; s.vx = (Math.random()-.5)*.15; s.vy = -(Math.random()*.3+.07); }
            if (s.x < -5) s.x = sW+5; if (s.x > sW+5) s.x = -5;
            sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            sctx.fillStyle = s.hue + (s.op * (.7 + Math.sin(s.phase)*.3)) + ')';
            sctx.fill();
        });
        requestAnimationFrame(animSpores);
    }
    animSpores();
    window.addEventListener('resize', () => { sW = sporeCanvas.width = window.innerWidth; sH = sporeCanvas.height = window.innerHeight; }, { passive:true });
})();

/* ═══════════════════════════════════════════
   TV NOISE CANVAS
═══════════════════════════════════════════ */
(function initNoise() {
    const nc = document.getElementById('noise-canvas');
    const nctx = nc.getContext('2d');
    nc.width = 256; nc.height = 256;
    function draw() {
        const img = nctx.createImageData(256,256), d = img.data;
        for (let i = 0; i < d.length; i+=4) { const v = Math.random()*255|0; d[i]=v; d[i+1]=v; d[i+2]=v; d[i+3]=255; }
        nctx.putImageData(img, 0, 0); setTimeout(draw, 85);
    }
    draw();
    document.querySelectorAll('.event-card').forEach(c => {
        c.addEventListener('mouseenter', () => { nc.style.opacity='0.075'; setTimeout(()=>{ nc.style.opacity='0.032'; }, 380); });
    });
})();

/* ═══════════════════════════════════════════
   IDEA 6 — 3D TILT + HOLOGRAPHIC SHINE
═══════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
    const shine = card.querySelector('.holo-shine');
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / (rect.width/2);
        const dy = (e.clientY - cy) / (rect.height/2);
        const rx = dy * 12; // pitch
        const ry = -dx * 12; // yaw
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px) scale(1.02)`;
        // Holographic shine follows mouse
        if (shine) {
            const px = ((e.clientX - rect.left) / rect.width) * 100;
            const py = ((e.clientY - rect.top) / rect.height) * 100;
            shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,180,50,0.1) 0%, rgba(50,200,255,0.07) 30%, rgba(200,50,255,0.05) 60%, transparent 80%)`;
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        if (shine) shine.style.background = '';
    });
});

/* ═══════════════════════════════════════════
   IDEA 7 — AMBIENT SOUND (Web Audio API)
═══════════════════════════════════════════ */
(function initSound() {
    const btn = document.getElementById('sound-btn');
    const onIcon = document.getElementById('sound-on-icon');
    const offIcon = document.getElementById('sound-off-icon');
    let audioCtx = null, nodes = [], playing = false;

    function createAmbience() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const master = audioCtx.createGain();
        master.gain.setValueAtTime(0.001, audioCtx.currentTime);
        master.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 2);
        master.connect(audioCtx.destination);

        // Low drone — Stranger Things synth bass
        const droneFreqs = [55, 110, 82.4];
        droneFreqs.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            g.gain.value = 0.08;
            osc.connect(g); g.connect(master);
            osc.start();
            nodes.push(osc);
            // Subtle vibrato
            const lfo = audioCtx.createOscillator();
            const lfoG = audioCtx.createGain();
            lfo.frequency.value = 0.3; lfoG.gain.value = 0.5;
            lfo.connect(lfoG); lfoG.connect(osc.frequency);
            lfo.start(); nodes.push(lfo);
        });

        // Wind noise
        const bufSize = audioCtx.sampleRate * 2;
        const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random()*2-1;
        const wind = audioCtx.createBufferSource();
        wind.buffer = buf; wind.loop = true;
        const wFilter = audioCtx.createBiquadFilter();
        wFilter.type = 'bandpass'; wFilter.frequency.value = 400; wFilter.Q.value = 0.5;
        const wGain = audioCtx.createGain(); wGain.gain.value = 0.06;
        wind.connect(wFilter); wFilter.connect(wGain); wGain.connect(master);
        wind.start(); nodes.push(wind);

        // Electric hum
        const hum = audioCtx.createOscillator();
        const humG = audioCtx.createGain();
        hum.type = 'square'; hum.frequency.value = 60; humG.gain.value = 0.015;
        hum.connect(humG); humG.connect(master); hum.start(); nodes.push(hum);

        return master;
    }

    btn.addEventListener('click', () => {
        if (!playing) {
            if (!audioCtx) createAmbience();
            else audioCtx.resume();
            playing = true; btn.classList.add('playing');
            onIcon.style.display = 'none'; offIcon.style.display = '';
        } else {
            audioCtx.suspend();
            playing = false; btn.classList.remove('playing');
            onIcon.style.display = ''; offIcon.style.display = 'none';
        }
    });

    // Hover sound on cards — short blip
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!playing || !audioCtx) return;
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'square'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
            g.gain.setValueAtTime(0.04, audioCtx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            osc.connect(g); g.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + 0.08);
        });
    });
})();

/* ═══════════════════════════════════════════
   IDEA 8 — DEMOGORGON MOBILE MENU
═══════════════════════════════════════════ */
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const backdrop = document.getElementById('mobile-nav-backdrop');
const mobileStatic = document.getElementById('mobile-nav-static');

function openMobileNav() {
    menuBtn.classList.add('open');
    mobileNav.classList.add('open');
    backdrop.classList.add('show');
    // Static burst effect
    mobileStatic.style.opacity = '0.08';
    setTimeout(() => { mobileStatic.style.opacity = '0'; }, 300);
}
function closeMobileNav() {
    menuBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    backdrop.classList.remove('show');
}
menuBtn.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
});

/* ═══════════════════════════════════════════
   IDEA 10 — PORTAL REGISTER RIPPLE
═══════════════════════════════════════════ */
document.querySelectorAll('.register-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const rippleEl = document.getElementById('portal-ripple');
        const x = e.clientX, y = e.clientY;
        rippleEl.innerHTML = '';
        rippleEl.style.setProperty('--ox', x + 'px');
        rippleEl.style.setProperty('--oy', y + 'px');

        // BG flash
        const bg = document.createElement('div');
        bg.className = 'ripple-bg'; bg.style.setProperty('--ox', x + 'px'); bg.style.setProperty('--oy', y + 'px');
        rippleEl.appendChild(bg);

        // Rings
        const colors = ['rgba(200,30,0,0.8)','rgba(160,0,220,0.6)','rgba(200,100,0,0.5)','rgba(100,0,200,0.4)','rgba(200,30,0,0.3)'];
        colors.forEach((color, i) => {
            const ring = document.createElement('div');
            ring.className = 'ripple-ring';
            ring.style.cssText = `left:${x}px;top:${y}px;width:60px;height:60px;border-color:${color};animation-delay:${i * 0.12}s;animation-duration:${0.9 + i * 0.15}s`;
            rippleEl.appendChild(ring);
        });

        rippleEl.classList.add('active');
        setTimeout(() => {
            rippleEl.classList.remove('active');
            rippleEl.innerHTML = '';
        }, 1800);
    });
});

/* ═══════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════ */
const dot = document.getElementById('cursor-dot');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; }, { passive:true });
(function animCursor() { tx += (mx-tx)*.13; ty += (my-ty)*.13; trail.style.left=tx+'px'; trail.style.top=ty+'px'; requestAnimationFrame(animCursor); })();
if ('ontouchstart' in window) { dot.style.display='none'; trail.style.display='none'; document.body.style.cursor='auto'; }

/* ═══════════════════════════════════════════
   SCROLL HANDLER — Parallax + Vines + Nav
═══════════════════════════════════════════ */
const nav = document.getElementById('main-nav');
const layerSky = document.getElementById('layer-sky');
const layerStars = document.getElementById('layer-stars');
const layerMist = document.getElementById('layer-mist');
const heroContent = document.getElementById('hero-content');
const vines = document.querySelectorAll('.vine');
let ticking = false;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollVel = scrollY - lastSY; lastSY = scrollY;
    if (!ticking) { requestAnimationFrame(() => { handleScroll(scrollY); ticking=false; }); ticking=true; }
}, { passive:true });

function handleScroll(sy) {
    nav.classList.toggle('scrolled', sy > 60);
    if (layerSky)    layerSky.style.transform    = `translateY(${sy*.28}px)`;
    if (layerStars)  layerStars.style.transform  = `translateY(${sy*.22}px)`;
    if (layerMist)   layerMist.style.transform   = `translateY(${sy*.5}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${sy*.18}px)`;
    const pct = sy / Math.max(1, document.body.scrollHeight - window.innerHeight);
    vines.forEach((v, i) => { v.classList.toggle('grow', pct > 0.04 + i * 0.04); });
}

/* ═══════════════════════════════════════════
   FLICKER LETTER REVEAL
═══════════════════════════════════════════ */
const flickObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && !e.target.dataset.done) { flickerIn(e.target); e.target.dataset.done='1'; } });
}, { threshold:0.5 });
document.querySelectorAll('[data-flicker]').forEach(el => flickObs.observe(el));

function flickerIn(el) {
    const text = el.textContent; el.innerHTML = '';
    [...text].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch===' ' ? '\u00A0' : ch;
        s.style.cssText = 'display:inline-block;opacity:0;transition:text-shadow .4s';
        el.appendChild(s);
        const d = Math.random()*700 + i*35;
        setTimeout(() => {
            s.style.opacity='.8'; s.style.textShadow='0 0 22px #ff3300';
            setTimeout(()=>{s.style.opacity='.15';s.style.textShadow='none'},70);
            setTimeout(()=>{s.style.opacity='.95';s.style.textShadow='0 0 16px #ff3300'},140);
            setTimeout(()=>{s.style.opacity='.3'},210);
            setTimeout(()=>{s.style.opacity='1';s.style.textShadow='0 0 8px rgba(200,25,0,.28)'},300);
        }, d);
    });
}
