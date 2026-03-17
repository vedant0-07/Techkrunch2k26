/**
 * PRAGYOTSAV 2K26 — MOBILE-OPTIMIZED ENGINE
 * Touch-first, gyroscope spores, tap modals,
 * reduced motion respect, 60fps on low-end phones
 */

const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const IS_MOBILE = window.innerWidth < 768 || IS_TOUCH;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════
   PIN DATA (Hawkins Map)
═══════════════════════════════════════ */
const PIN_DATA = {
    1:{num:'01',title:'Robo Soccer',    desc:'Hawkins High Gym — Teams battle with robots in a soccer arena. Precision engineering meets real-time strategy.'},
    2:{num:'02',title:'BGMI Championship', desc:'Hawkins Lab — Competitive BGMI under classified conditions. Teamwork, reflex, survival.'},
    3:{num:'03',title:'Free Fire',      desc:'The Upside Down — Battle royale where only the bold survive. Last squad standing wins.'},
    4:{num:'04',title:'Theme Based Quiz', desc:'Byers House — Decode the clues before the lights go dark. Knowledge, speed, nerve.'},
    5:{num:'05',title:'IPL Auction',    desc:'Scoops Ahoy — Bid like your season depends on it. Budget smart, build the best team.'},
    6:{num:'06',title:'Project Competition', desc:"Wheeler's Basement — Present innovations to save the world. Build what hasn't been seen yet."},
};

/* ═══════════════════════════════════════
   1. GLITCH INTRO
═══════════════════════════════════════ */
(function glitchIntro() {
    const overlay = document.getElementById('glitch-overlay');
    const gc = document.getElementById('glitch-canvas');
    if (!gc) return;
    const gctx = gc.getContext('2d');
    const gl1 = document.getElementById('gl1');
    const gl3 = document.getElementById('gl3');
    let frame = 0, stopped = false;

    function resize() { gc.width = window.innerWidth; gc.height = window.innerHeight; }
    resize();

    const bars = Array.from({length: IS_MOBILE ? 8 : 12}, () => ({
        y: Math.random() * window.innerHeight,
        h: Math.random() * 5 + 2,
        x: (Math.random() - 0.5) * 30,
        speed: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2
    }));

    function draw() {
        if (stopped) return;
        frame++;
        gctx.clearRect(0, 0, gc.width, gc.height);
        for (let y = 0; y < gc.height; y += 4) {
            gctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.05})`;
            gctx.fillRect(0, y, gc.width, 1);
        }
        bars.forEach(b => {
            b.y += b.speed; if (b.y > gc.height) b.y = -b.h;
            gctx.fillStyle = `rgba(${170 + Math.random()*40},${Math.random()*15},${Math.random()*12},${b.alpha})`;
            gctx.fillRect(b.x, b.y, gc.width * (0.3 + Math.random() * 0.7), b.h);
        });
        if (Math.random() > 0.65) {
            const ry = Math.random() * gc.height;
            gctx.fillStyle = 'rgba(255,0,0,0.07)'; gctx.fillRect(-6, ry, gc.width, 2);
            gctx.fillStyle = 'rgba(0,0,200,0.07)'; gctx.fillRect(6, ry+1, gc.width, 2);
        }
        const pct = Math.min(frame / 80, 1);
        const b = Math.floor(pct * 10);
        gl3.textContent = '■'.repeat(b) + '░'.repeat(10 - b) + ` ${Math.floor(pct*100)}%`;
        if (frame % 8 === 0) gl1.classList.toggle('gl-glitch');
        requestAnimationFrame(draw);
    }
    draw();

    const dur = IS_MOBILE ? 2000 : 2400;
    setTimeout(() => {
        stopped = true;
        overlay.classList.add('fade-out');
        document.body.classList.remove('loading');
        setTimeout(() => { overlay.remove(); }, 600);
        startMorseTypewriter();
    }, dur);
})();

/* ═══════════════════════════════════════
   2. MORSE TYPEWRITER
═══════════════════════════════════════ */
function startMorseTypewriter() {
    AOS.init({ duration: IS_MOBILE ? 800 : 1000, once: false, mirror: true, offset: 40, easing: 'ease-out-cubic', disable: REDUCED ? 'all' : false });

    const el = document.getElementById('hero-tagline');
    if (!el || REDUCED) {
        if (el) el.textContent = '"Enter the Upside Down of Technology"';
        return;
    }
    const final = '"Enter the Upside Down of Technology"';
    const morseMap = {A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',' ':' ','"':"'"};
    const morse = final.toUpperCase().split('').map(c => morseMap[c] || c).join(' ');
    let i = 0;

    function typeMorse() {
        if (i <= morse.length) {
            el.innerHTML = `<span style="opacity:.5;letter-spacing:.12em">${morse.slice(0,i)}</span><span class="cursor-blink"></span>`;
            i++; setTimeout(typeMorse, 18);
        } else {
            setTimeout(decode, 350);
        }
    }
    function decode() {
        let iter = 0; const max = 16;
        const chars = '.-_ ';
        const id = setInterval(() => {
            const rev = Math.floor((iter / max) * final.length);
            let d = '';
            for (let j = 0; j < final.length; j++) {
                d += j < rev ? final[j] : chars[Math.floor(Math.random() * chars.length)];
            }
            el.innerHTML = `${d}<span class="cursor-blink"></span>`;
            iter++;
            if (iter >= max) {
                clearInterval(id);
                el.innerHTML = final + '<span class="cursor-blink"></span>';
                setTimeout(() => { el.textContent = final; }, 1800);
            }
        }, 75);
    }
    setTimeout(typeMorse, 600);
}

/* ═══════════════════════════════════════
   3. SCENE CANVAS (Day→Night on scroll)
═══════════════════════════════════════ */
const sceneCanvas = document.getElementById('scene-canvas');
const sc = sceneCanvas.getContext('2d');
let W = 0, H = 0, scrollY = 0, scrollVel = 0, lastSY = 0;
let sceneT = 0, lightningTimer = 180, lightningA = 0, demoPhase = 0;

function resizeScene() {
    W = sceneCanvas.width  = window.innerWidth;
    H = sceneCanvas.height = window.innerHeight;
}
resizeScene();
window.addEventListener('resize', resizeScene, { passive: true });

function drawScene() {
    sceneT++;
    sc.clearRect(0, 0, W, H);
    const maxS = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const t = Math.min(scrollY / (maxS * 0.45), 1);

    drawSkyFX(t);
    drawMoon(t);
    drawForest(t);
    drawGround(t);
    drawRoad(t);
    drawDemo(t);
    drawRiders();
    requestAnimationFrame(drawScene);
}
drawScene();

function drawSkyFX(t) {
    lightningTimer--;
    if (lightningTimer <= 0) {
        lightningA = (0.03 + Math.random() * 0.05) * (1 + t * 2);
        lightningTimer = Math.random() * (280 - t * 180) + 55;
    }
    lightningA *= 0.91;
    if (lightningA > 0.004) {
        const lg = sc.createRadialGradient(W*.7, H*.1, 0, W*.7, H*.1, W*.38);
        lg.addColorStop(0, `rgba(180,60,20,${lightningA})`); lg.addColorStop(1, 'transparent');
        sc.fillStyle = lg; sc.fillRect(0, 0, W, H * .6);
    }
    for (let i = 0; i < 3; i++) {
        const ay = H * (.55 + i * .04) + Math.sin(sceneT * .0003 + i * 1.5) * 7;
        const ag = sc.createLinearGradient(0, ay-10, 0, ay+10);
        ag.addColorStop(0, 'transparent');
        ag.addColorStop(.5, `rgba(${60+t*35},0,${5+t*12},${(.055+t*.07)-i*.014})`);
        ag.addColorStop(1, 'transparent');
        sc.fillStyle = ag; sc.fillRect(0, ay-10, W, 20);
    }
}

function drawMoon(t) {
    const mx = W * .72, my = H * (.22 - t * .04) + Math.sin(sceneT * .0004) * 3;
    const mr = Math.max(32, Math.min(W * .06, 60));
    for (let i = 3; i >= 1; i--) {
        const g = sc.createRadialGradient(mx, my, mr*.8, mx, my, mr+i*18);
        g.addColorStop(0, `rgba(${60+t*35},0,${5+t*8},${(.065/i)*(1+t)})`); g.addColorStop(1, 'transparent');
        sc.beginPath(); sc.arc(mx, my, mr+i*18, 0, Math.PI*2); sc.fillStyle=g; sc.fill();
    }
    const mg = sc.createRadialGradient(mx-mr*.3, my-mr*.3, mr*.05, mx, my, mr);
    mg.addColorStop(0, `rgb(${42+t*18},${8-t*3},8)`);
    mg.addColorStop(.5, `rgb(${26-t*4},3,5)`);
    mg.addColorStop(1, 'rgb(13,1,8)');
    sc.beginPath(); sc.arc(mx, my, mr, 0, Math.PI*2); sc.fillStyle=mg; sc.fill();
    sc.beginPath(); sc.arc(mx, my, mr, 0, Math.PI*2);
    sc.strokeStyle=`rgba(${180+t*18},${20-t*8},10,${.22+t*.18})`; sc.lineWidth=1.2; sc.stroke();
}

function drawForest(t) {
    const gy = H * .78;
    const sw = Math.sin(sceneT * (.0006 + t * .0003)) * (1.2 + t * 1.4);
    const c3 = `rgba(${8},${2+(1-t)*4},4,${.65+t*.28})`;
    const c2 = `rgba(5,${1+(1-t)*2},3,${.82+t*.14})`;
    drawTL(gy+28, .55, c3, IS_MOBILE?12:18, 1.0, 0,  sw*.3);
    drawTL(gy+12, .75, c2, IS_MOBILE?10:14, 1.3, 7,  sw*.6);
    drawTL(gy,    1.0, 'rgba(2,0,2,0.97)', IS_MOBILE?8:11, 1.7, 17, sw);
}

function drawTL(baseY, scale, color, count, hm, seed, sway) {
    sc.fillStyle = color; sc.beginPath(); sc.moveTo(0, baseY);
    const sp = W / count;
    for (let i = 0; i <= count; i++) {
        const x = i*sp + (((seed*37+i*97)%100)/100-.5)*sp*.4;
        const tH = (60+((seed*53+i*71)%80))*scale*hm;
        const tW = (16+((seed*29+i*43)%26))*scale;
        drawT(x+sway, baseY, tH, tW);
    }
    sc.lineTo(W, baseY); sc.closePath(); sc.fill();
}

function drawT(x, baseY, h, w) {
    sc.moveTo(x,baseY); sc.lineTo(x-w*.5,baseY); sc.lineTo(x-w*.3,baseY-h*.35);
    sc.lineTo(x-w*.44,baseY-h*.35); sc.lineTo(x-w*.21,baseY-h*.62);
    sc.lineTo(x-w*.34,baseY-h*.62); sc.lineTo(x-w*.1,baseY-h*.82);
    sc.lineTo(x,baseY-h);
    sc.lineTo(x+w*.1,baseY-h*.82); sc.lineTo(x+w*.34,baseY-h*.62);
    sc.lineTo(x+w*.21,baseY-h*.62); sc.lineTo(x+w*.44,baseY-h*.35);
    sc.lineTo(x+w*.3,baseY-h*.35); sc.lineTo(x+w*.5,baseY);
}

function drawGround(t) {
    const gy = H*.78;
    const g = sc.createLinearGradient(0,gy,0,H);
    g.addColorStop(0,`rgba(${3+t*2},0,${2+t*2},0.98)`); g.addColorStop(1,'rgba(2,0,1,1)');
    sc.fillStyle=g; sc.fillRect(0,gy,W,H-gy);
    for (let i=0;i<3;i++) {
        const gm=sc.createRadialGradient(W*(.2+i*.3)+Math.sin(sceneT*.0003+i)*16,gy+4,0,W*(.2+i*.3),gy+4,W*.2);
        gm.addColorStop(0,`rgba(${55+t*25},0,${5+t*8},${.055+t*.04})`); gm.addColorStop(1,'transparent');
        sc.beginPath(); sc.ellipse(W*(.2+i*.3)+Math.sin(sceneT*.0003+i)*16,gy+6,W*.2,28,0,0,Math.PI*2);
        sc.fillStyle=gm; sc.fill();
    }
}

function drawRoad(t) {
    const ry=H*.82;
    const g=sc.createLinearGradient(0,ry,0,H);
    g.addColorStop(0,`rgba(${6+t*3},3,${4+t*3},0.9)`); g.addColorStop(1,'rgba(4,2,3,0.95)');
    sc.fillStyle=g; sc.beginPath(); sc.moveTo(0,ry); sc.lineTo(W,ry); sc.lineTo(W,H); sc.lineTo(0,H); sc.closePath(); sc.fill();
    sc.setLineDash([25,22]); sc.strokeStyle=`rgba(${75+t*18},40,${38+t*18},${.16+t*.08})`; sc.lineWidth=1.5;
    sc.beginPath(); sc.moveTo(0,H*.874); sc.lineTo(W,H*.874); sc.stroke(); sc.setLineDash([]);
}

function drawDemo(t) {
    if (t < 0.05) return;
    demoPhase += .0008;
    const bob = Math.sin(demoPhase)*7;
    const rise = Math.min(t*3, 1);
    const s = (IS_MOBILE ? 0.45 : 0.8) * rise;
    const dx = W*.14, dy = H*(.58+(1-rise)*.22)+bob;
    sc.save(); sc.translate(dx,dy); sc.scale(s,s); sc.globalAlpha = rise*(.22+Math.sin(demoPhase*1.4)*.04);
    const aura=sc.createRadialGradient(0,-28,8,0,-28,90);
    aura.addColorStop(0,`rgba(${80+t*35},0,${5+t*12},.16)`); aura.addColorStop(1,'transparent');
    sc.fillStyle=aura; sc.beginPath(); sc.arc(0,-28,90,0,Math.PI*2); sc.fill();
    sc.fillStyle='rgba(4,0,2,.88)';
    sc.beginPath(); sc.ellipse(0,0,35,50,0,0,Math.PI*2); sc.fill();
    sc.beginPath(); sc.arc(0,-55,30,0,Math.PI*2); sc.fill();
    for (let p=0;p<6;p++) {
        const ang=(p/6)*Math.PI*2-Math.PI/2;
        sc.beginPath(); sc.ellipse(Math.cos(ang)*25,-55+Math.sin(ang)*25,12,20,ang,0,Math.PI*2); sc.fill();
    }
    const v=sc.createRadialGradient(0,-55,0,0,-55,22);
    v.addColorStop(0,'rgba(0,0,0,.9)'); v.addColorStop(1,'transparent');
    sc.fillStyle=v; sc.beginPath(); sc.arc(0,-55,22,0,Math.PI*2); sc.fill();
    sc.fillStyle='rgba(4,0,2,.88)';
    [[-1,-.3],[1,-.3],[-1.2,0],[1.2,0]].forEach(([ax,ay])=>{
        const sw=Math.sin(demoPhase+ax)*5;
        sc.beginPath(); sc.moveTo(ax*28,ay*26);
        sc.bezierCurveTo(ax*55+sw,ay*26-28,ax*82+sw*2,18+sw,ax*100+sw*3,36+sw*2);
        sc.lineTo(ax*96,40); sc.bezierCurveTo(ax*72,20,ax*50,-26,ax*24,ay*26); sc.closePath(); sc.fill();
    });
    sc.restore();
}

function drawRiders() {
    const ry = H*.836;
    [[.29,1.1,0],[.44,1.05,.8],[.57,1.15,1.6]].forEach(([xp,s,ph])=>{
        const bob=Math.sin(sceneT*.08+ph)*1.4;
        const x=W*xp;
        drawBike(x,ry+bob,s,.9);
        if (xp===.29) drawBeam(x+20*s,ry-24*s+bob);
    });
    [[.64,.5,.48],[.71,.44,.36]].forEach(([xp,s,a])=>drawBike(W*xp,ry,s,a));
}

function drawBike(x,y,scale,alpha) {
    sc.save(); sc.translate(x,y); sc.scale(scale,scale); sc.globalAlpha=alpha;
    sc.lineWidth=3.2; sc.strokeStyle='rgba(0,0,0,.95)';
    sc.beginPath(); sc.arc(-26,13,18,0,Math.PI*2); sc.stroke();
    sc.beginPath(); sc.arc(26,13,18,0,Math.PI*2); sc.stroke();
    for (let a=0;a<Math.PI*2;a+=Math.PI/4) {
        sc.lineWidth=.7;
        sc.beginPath(); sc.moveTo(-26+Math.cos(a)*5,13+Math.sin(a)*5); sc.lineTo(-26+Math.cos(a)*17,13+Math.sin(a)*17); sc.stroke();
        sc.beginPath(); sc.moveTo(26+Math.cos(a)*5,13+Math.sin(a)*5); sc.lineTo(26+Math.cos(a)*17,13+Math.sin(a)*17); sc.stroke();
    }
    sc.lineWidth=3.2;
    sc.beginPath(); sc.moveTo(-26,13); sc.lineTo(2,-8); sc.stroke();
    sc.beginPath(); sc.moveTo(-26,13); sc.lineTo(28,13); sc.stroke();
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(26,13); sc.stroke();
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(2,13); sc.stroke();
    sc.beginPath(); sc.moveTo(17,-6); sc.lineTo(26,13); sc.stroke();
    sc.lineWidth=2.2;
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(18,-8); sc.stroke();
    sc.beginPath(); sc.moveTo(18,-8); sc.lineTo(21,-14); sc.stroke();
    sc.beginPath(); sc.moveTo(19,-14); sc.lineTo(23,-14); sc.stroke();
    sc.lineWidth=2;
    sc.beginPath(); sc.moveTo(2,-8); sc.lineTo(2,-15); sc.stroke();
    sc.beginPath(); sc.moveTo(-3,-15); sc.lineTo(7,-15); sc.stroke();
    sc.fillStyle='rgba(0,0,0,.95)';
    sc.beginPath(); sc.moveTo(0,-15); sc.lineTo(13,-24); sc.lineTo(15,-20); sc.lineTo(3,-11); sc.closePath(); sc.fill();
    sc.beginPath(); sc.arc(14,-27,6.5,0,Math.PI*2); sc.fill();
    sc.beginPath(); sc.arc(6,-20,5,0,Math.PI*2); sc.fill();
    sc.lineWidth=3.5; sc.strokeStyle='rgba(0,0,0,.95)';
    sc.beginPath(); sc.moveTo(13,-24); sc.lineTo(21,-13); sc.stroke();
    sc.lineWidth=3;
    sc.beginPath(); sc.moveTo(2,-11); sc.lineTo(-7,2); sc.stroke();
    sc.beginPath(); sc.moveTo(-7,2); sc.lineTo(-5,13); sc.stroke();
    sc.beginPath(); sc.moveTo(2,-11); sc.lineTo(9,3); sc.stroke();
    sc.beginPath(); sc.moveTo(9,3); sc.lineTo(7,13); sc.stroke();
    sc.restore();
}

function drawBeam(x,y) {
    sc.save(); sc.translate(x,y);
    const fg=sc.createRadialGradient(0,0,0,0,0,230);
    fg.addColorStop(0,'rgba(255,230,200,0.08)'); fg.addColorStop(.4,'rgba(255,210,180,0.03)'); fg.addColorStop(1,'transparent');
    sc.fillStyle=fg; sc.beginPath(); sc.moveTo(0,0); sc.arc(0,0,230,-.2,.2); sc.closePath(); sc.fill();
    sc.restore();
}

/* ═══════════════════════════════════════
   4. SPORE PARTICLES (gyro on mobile)
═══════════════════════════════════════ */
(function initSpores() {
    const sc2 = document.getElementById('spore-canvas');
    const ctx = sc2.getContext('2d');
    let sW = window.innerWidth, sH = window.innerHeight;
    sc2.width = sW; sc2.height = sH;
    let mouseX = sW/2, mouseY = sH/2;
    let gyroX = 0, gyroY = 0;
    const COUNT = IS_MOBILE ? 45 : 80;

    if (IS_TOUCH) {
        window.addEventListener('deviceorientation', e => {
            gyroX = (e.gamma||0)/30;
            gyroY = (e.beta||0)/45;
        }, { passive:true });
    } else {
        document.addEventListener('mousemove', e => { mouseX=e.clientX; mouseY=e.clientY; }, { passive:true });
    }

    const spores = Array.from({length:COUNT}, ()=>({
        x:Math.random()*sW, y:Math.random()*sH,
        vx:(Math.random()-.5)*.14, vy:-(Math.random()*.28+.06),
        r:Math.random()*1.4+.3,
        op:Math.random()*.38+.07,
        phase:Math.random()*Math.PI*2,
        hue:['rgba(165,25,210,','rgba(250,30,12,','rgba(235,175,55,','rgba(90,0,150,'][Math.floor(Math.random()*4)]
    }));

    function anim() {
        ctx.clearRect(0,0,sW,sH);
        const boost = 1 + Math.abs(scrollVel)*.04;
        const REPEL = IS_MOBILE ? 90 : 110;
        const FORCE = IS_MOBILE ? 0.55 : 0.75;
        const repX = IS_TOUCH ? sW/2 + gyroX*sW*.28 : mouseX;
        const repY = IS_TOUCH ? sH/2 + gyroY*sH*.28 : mouseY;

        spores.forEach(s => {
            s.phase += .007;
            const dx=s.x-repX, dy=s.y-repY;
            const d=Math.sqrt(dx*dx+dy*dy);
            if (d < REPEL && d > 0) {
                const f=(REPEL-d)/REPEL*FORCE;
                s.vx += (dx/d)*f*.14; s.vy += (dy/d)*f*.14;
            }
            s.vx *= .97; s.vy = s.vy*.97-(0.045+Math.random()*.018)*boost;
            s.x += s.vx+Math.sin(s.phase)*.09; s.y += s.vy;
            if (s.y<-4){s.y=sH+4;s.x=Math.random()*sW;s.vx=(Math.random()-.5)*.14;s.vy=-(Math.random()*.28+.06)}
            if (s.x<-4) s.x=sW+4; if (s.x>sW+4) s.x=-4;
            ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
            ctx.fillStyle=s.hue+(s.op*(.68+Math.sin(s.phase)*.28))+')';
            ctx.fill();
        });
        requestAnimationFrame(anim);
    }
    anim();
    window.addEventListener('resize',()=>{ sW=sc2.width=window.innerWidth; sH=sc2.height=window.innerHeight; },{passive:true});
})();

/* ═══════════════════════════════════════
   5. TV NOISE
═══════════════════════════════════════ */
(function initNoise() {
    const nc=document.getElementById('noise-canvas');
    const nctx=nc.getContext('2d');
    nc.width=200; nc.height=200;
    function draw() {
        const img=nctx.createImageData(200,200),d=img.data;
        for (let i=0;i<d.length;i+=4){const v=Math.random()*255|0;d[i]=v;d[i+1]=v;d[i+2]=v;d[i+3]=255;}
        nctx.putImageData(img,0,0); setTimeout(draw,90);
    }
    draw();
    document.querySelectorAll('.event-card').forEach(c=>{
        c.addEventListener(IS_TOUCH?'touchstart':'mouseenter',()=>{
            nc.style.opacity='.07'; setTimeout(()=>{nc.style.opacity='.028';},340);
        },{passive:true});
    });
})();

/* ═══════════════════════════════════════
   6. HAWKINS MAP
═══════════════════════════════════════ */
(function initMap() {
    const mc=document.getElementById('map-canvas');
    if (!mc) return;
    const mctx=mc.getContext('2d');

    function drawMap() {
        const mw=mc.offsetWidth||mc.parentElement.offsetWidth, mh=mc.offsetHeight||mw*.5625;
        mc.width=mw; mc.height=mh;
        const bg=mctx.createLinearGradient(0,0,mw,mh);
        bg.addColorStop(0,'#070305'); bg.addColorStop(.5,'#0a0408'); bg.addColorStop(1,'#060204');
        mctx.fillStyle=bg; mctx.fillRect(0,0,mw,mh);
        mctx.strokeStyle='rgba(200,30,0,0.04)'; mctx.lineWidth=1;
        for(let x=0;x<mw;x+=50){mctx.beginPath();mctx.moveTo(x,0);mctx.lineTo(x,mh);mctx.stroke();}
        for(let y=0;y<mh;y+=50){mctx.beginPath();mctx.moveTo(0,y);mctx.lineTo(mw,y);mctx.stroke();}
        mctx.strokeStyle='rgba(100,60,40,0.32)'; mctx.lineWidth=1.5; mctx.setLineDash([7,6]);
        [[.1*mw,.5*mh,.35*mw,.45*mh,.6*mw,.5*mh,.9*mw,.48*mh],
         [.5*mw,.1*mh,.48*mw,.38*mh,.52*mw,.62*mh,.5*mw,.9*mh],
         [.15*mw,.2*mh,.4*mw,.3*mh,.7*mw,.25*mh],
         [.2*mw,.72*mh,.45*mw,.76*mh,.72*mw,.82*mh,.85*mw,.74*mh]].forEach(pts=>{
            mctx.beginPath(); mctx.moveTo(pts[0],pts[1]);
            for(let i=2;i<pts.length;i+=2) mctx.lineTo(pts[i],pts[i+1]);
            mctx.stroke();
        });
        mctx.setLineDash([]);
        mctx.fillStyle='rgba(8,18,6,0.42)';
        [[.08,.25,55,36],[.82,.15,46,32],[.15,.76,42,28],[.78,.83,50,34],[.46,.86,46,26]].forEach(([x,y,w,h])=>{
            mctx.beginPath(); mctx.ellipse(x*mw,y*mh,w,h,0,0,Math.PI*2); mctx.fill();
        });
        const pins=[{x:.22,y:.38},{x:.55,y:.22},{x:.75,y:.55},{x:.40,y:.65},{x:.18,y:.68},{x:.62,y:.78}];
        mctx.strokeStyle='rgba(180,20,0,0.22)'; mctx.lineWidth=1; mctx.setLineDash([3,4]);
        for(let i=0;i<pins.length;i++) for(let j=i+1;j<pins.length;j++) {
            if(Math.random()>.44){
                mctx.beginPath(); mctx.moveTo(pins[i].x*mw,pins[i].y*mh);
                const cx=(pins[i].x+pins[j].x)/2*mw+(Math.random()-.5)*28;
                const cy=(pins[i].y+pins[j].y)/2*mh+(Math.random()-.5)*18;
                mctx.quadraticCurveTo(cx,cy,pins[j].x*mw,pins[j].y*mh); mctx.stroke();
            }
        }
        mctx.setLineDash([]);
        mctx.font=`italic ${Math.max(9,mw*.012)}px 'Share Tech Mono',monospace`;
        mctx.fillStyle='rgba(180,100,60,0.18)';
        mctx.fillText('HAWKINS, INDIANA',10,mh-10);
        mctx.fillText('CLASSIFIED',mw-75,16);
    }
    drawMap();
    window.addEventListener('resize',drawMap,{passive:true});

    // TAP on pins → mobile bottom sheet modal
    const modal=document.getElementById('pin-modal');
    const closeBtn=document.getElementById('pin-modal-close');
    if (!modal) return;

    document.querySelectorAll('.pin-dot').forEach(dot=>{
        // Both click and touchend
        ['click','touchend'].forEach(ev=>{
            dot.addEventListener(ev, e=>{
                e.preventDefault(); e.stopPropagation();
                const id=dot.dataset.pin;
                const data=PIN_DATA[id];
                if(!data) return;
                document.getElementById('pm-num').textContent=data.num;
                document.getElementById('pm-title').textContent=data.title;
                document.getElementById('pm-desc').textContent=data.desc;
                modal.classList.remove('hidden');
            },{passive:false});
        });
    });

    function closeModal(){modal.classList.add('hidden');}
    if(closeBtn) closeBtn.addEventListener('click',closeModal);
    document.addEventListener('touchstart',e=>{
        if(modal && !modal.contains(e.target) && !e.target.classList.contains('pin-dot')) closeModal();
    },{passive:true});

    // Desktop hover cards (inline, no modal)
    if (!IS_TOUCH) {
        document.querySelectorAll('.pin-dot').forEach(dot=>{
            let card=null;
            dot.addEventListener('mouseenter',()=>{
                const id=dot.dataset.pin; const data=PIN_DATA[id]; if(!data) return;
                card=document.createElement('div');
                card.style.cssText='position:absolute;bottom:26px;left:50%;transform:translateX(-50%);background:rgba(4,2,8,0.96);border:1px solid rgba(200,30,0,.28);padding:14px 16px;min-width:190px;max-width:230px;pointer-events:none;z-index:10;backdrop-filter:blur(10px)';
                card.innerHTML=`<div style="font-family:'Share Tech Mono',monospace;font-size:.58rem;color:rgba(200,30,0,.5);letter-spacing:.2em;margin-bottom:5px;text-transform:uppercase">${data.num}</div><div style="font-family:'Creepster',cursive;font-size:1.05rem;color:#fff;text-transform:uppercase;margin-bottom:5px">${data.title}</div><div style="font-size:.72rem;color:rgba(180,145,200,.6);line-height:1.6;margin-bottom:10px">${data.desc}</div><a href="#" style="font-family:'Share Tech Mono',monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#ff3300;text-decoration:none">Register →</a>`;
                dot.parentElement.style.position='relative';
                dot.parentElement.appendChild(card);
            });
            dot.addEventListener('mouseleave',()=>{ if(card){card.remove();card=null;} });
        });
    }
})();

/* ═══════════════════════════════════════
   7. 3D TILT + HOLO (desktop only)
═══════════════════════════════════════ */
if (!IS_TOUCH) {
    document.querySelectorAll('.event-card').forEach(card=>{
        const shine=card.querySelector('.holo-shine');
        card.addEventListener('mousemove',e=>{
            const r=card.getBoundingClientRect();
            const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
            const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
            card.style.transform=`perspective(750px) rotateX(${dy*11}deg) rotateY(${-dx*11}deg) translateY(-6px) scale(1.02)`;
            if(shine){
                const px=((e.clientX-r.left)/r.width)*100;
                const py=((e.clientY-r.top)/r.height)*100;
                shine.style.background=`radial-gradient(circle at ${px}% ${py}%,rgba(255,175,45,.09) 0%,rgba(45,195,255,.065) 30%,rgba(195,45,255,.05) 60%,transparent 80%)`;
                shine.style.opacity='1';
            }
        });
        card.addEventListener('mouseleave',()=>{
            card.style.transform='';
            if(shine){shine.style.background='';shine.style.opacity='0';}
        });
    });
}

/* ═══════════════════════════════════════
   8. AMBIENT SOUND
═══════════════════════════════════════ */
(function initSound() {
    const btn=document.getElementById('sound-btn');
    const onIco=document.getElementById('sound-on-icon');
    const offIco=document.getElementById('sound-off-icon');
    let actx=null, playing=false;

    function buildAudio(){
        actx=new (window.AudioContext||window.webkitAudioContext)();
        const master=actx.createGain();
        master.gain.setValueAtTime(.001,actx.currentTime);
        master.gain.linearRampToValueAtTime(.2,actx.currentTime+2);
        master.connect(actx.destination);
        [55,110,82.4].forEach(freq=>{
            const o=actx.createOscillator(),g=actx.createGain();
            o.type='sawtooth'; o.frequency.value=freq; g.gain.value=.07;
            o.connect(g); g.connect(master); o.start();
            const lfo=actx.createOscillator(),lg=actx.createGain();
            lfo.frequency.value=.3; lg.gain.value=.4;
            lfo.connect(lg); lg.connect(o.frequency); lfo.start();
        });
        const bufSz=actx.sampleRate*2,buf=actx.createBuffer(1,bufSz,actx.sampleRate);
        const dat=buf.getChannelData(0); for(let i=0;i<bufSz;i++) dat[i]=Math.random()*2-1;
        const w=actx.createBufferSource(); w.buffer=buf; w.loop=true;
        const wf=actx.createBiquadFilter(); wf.type='bandpass'; wf.frequency.value=380; wf.Q.value=.45;
        const wg=actx.createGain(); wg.gain.value=.055;
        w.connect(wf); wf.connect(wg); wg.connect(master); w.start();
        const h=actx.createOscillator(),hg=actx.createGain();
        h.type='square'; h.frequency.value=60; hg.gain.value=.012;
        h.connect(hg); hg.connect(master); h.start();
    }

    btn.addEventListener('click',()=>{
        if(!playing){
            if(!actx) buildAudio(); else actx.resume();
            playing=true; btn.classList.add('playing');
            onIco.style.display='none'; offIco.style.display='';
        } else {
            actx.suspend(); playing=false; btn.classList.remove('playing');
            onIco.style.display=''; offIco.style.display='none';
        }
    });

    document.querySelectorAll('.event-card').forEach(c=>{
        c.addEventListener(IS_TOUCH?'touchstart':'mouseenter',()=>{
            if(!playing||!actx) return;
            const o=actx.createOscillator(),g=actx.createGain();
            o.type='square'; o.frequency.setValueAtTime(700,actx.currentTime);
            o.frequency.exponentialRampToValueAtTime(180,actx.currentTime+.08);
            g.gain.setValueAtTime(.035,actx.currentTime);
            g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+.08);
            o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+.08);
        },{passive:true});
    });
})();

/* ═══════════════════════════════════════
   9. MOBILE MENU (Demogorgon mouth)
═══════════════════════════════════════ */
const menuBtn=document.getElementById('menu-btn');
const mobileNav=document.getElementById('mobile-nav');
const backdrop=document.getElementById('mob-backdrop');

function openMobileNav(){
    menuBtn.classList.add('open');
    mobileNav.classList.add('open');
    backdrop.classList.add('show');
    document.body.style.overflow='hidden';
}
function closeMobileNav(){
    menuBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.style.overflow='';
}
menuBtn.addEventListener('click',()=>{ mobileNav.classList.contains('open')?closeMobileNav():openMobileNav(); });

/* ═══════════════════════════════════════
   10. PORTAL RIPPLE on Register
═══════════════════════════════════════ */
document.querySelectorAll('.register-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
        e.preventDefault();
        const ripEl=document.getElementById('portal-ripple');
        // Get coords — touch or mouse
        let x,y;
        if(e.changedTouches&&e.changedTouches.length){
            x=e.changedTouches[0].clientX; y=e.changedTouches[0].clientY;
        } else { x=e.clientX; y=e.clientY; }
        ripEl.innerHTML='';
        const bg=document.createElement('div'); bg.className='ripple-bg';
        const grad=`radial-gradient(circle at ${x}px ${y}px,rgba(80,0,10,.32) 0%,transparent 50%)`;
        bg.style.background=grad; ripEl.appendChild(bg);
        const colors=['rgba(200,30,0,.8)','rgba(160,0,220,.55)','rgba(200,100,0,.45)','rgba(100,0,200,.35)'];
        colors.forEach((c,i)=>{
            const r=document.createElement('div'); r.className='ripple-ring';
            r.style.cssText=`left:${x}px;top:${y}px;width:50px;height:50px;border-color:${c};animation-delay:${i*.11}s;animation-duration:${.85+i*.14}s`;
            ripEl.appendChild(r);
        });
        ripEl.classList.add('active');
        setTimeout(()=>{ ripEl.classList.remove('active'); ripEl.innerHTML=''; },1600);
    });
});

/* ═══════════════════════════════════════
   DESKTOP CURSOR
═══════════════════════════════════════ */
if (!IS_TOUCH) {
    const dot=document.getElementById('cursor-dot');
    const trail=document.getElementById('cursor-trail');
    let mx=0,my=0,tx=0,ty=0;
    document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; },{passive:true});
    (function ac(){ tx+=(mx-tx)*.13; ty+=(my-ty)*.13; trail.style.left=tx+'px'; trail.style.top=ty+'px'; requestAnimationFrame(ac); })();
}

/* ═══════════════════════════════════════
   SCROLL HANDLER
═══════════════════════════════════════ */
const mainNav=document.getElementById('main-nav');
const layerSky=document.getElementById('layer-sky');
const layerStars=document.getElementById('layer-stars');
const layerMist=document.getElementById('layer-mist');
const heroContent=document.getElementById('hero-content');
const vines=document.querySelectorAll('.vine');
let ticking=false;

window.addEventListener('scroll',()=>{
    scrollY=window.scrollY;
    scrollVel=scrollY-lastSY; lastSY=scrollY;
    if(!ticking){ requestAnimationFrame(()=>{ handleScroll(scrollY); ticking=false; }); ticking=true; }
},{passive:true});

function handleScroll(sy){
    mainNav.classList.toggle('scrolled',sy>55);
    // Parallax only on desktop (saves mobile battery)
    if(!IS_MOBILE){
        if(layerSky)   layerSky.style.transform   =`translateY(${sy*.24}px)`;
        if(layerStars) layerStars.style.transform  =`translateY(${sy*.18}px)`;
        if(layerMist)  layerMist.style.transform   =`translateY(${sy*.42}px)`;
        if(heroContent) heroContent.style.transform=`translateY(${sy*.15}px)`;
    }
    const pct=sy/Math.max(1,document.body.scrollHeight-window.innerHeight);
    vines.forEach((v,i)=>{ v.classList.toggle('grow',pct>0.05+i*.05); });
}

/* ═══════════════════════════════════════
   FLICKER LETTER REVEAL
═══════════════════════════════════════ */
const flickObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting&&!e.target.dataset.done){ flickIn(e.target); e.target.dataset.done='1'; }});
},{threshold:.4});
document.querySelectorAll('[data-flicker]').forEach(el=>flickObs.observe(el));

function flickIn(el){
    if(REDUCED){ return; }
    const text=el.textContent; el.innerHTML='';
    [...text].forEach((ch,i)=>{
        const s=document.createElement('span');
        s.textContent=ch===' '?'\u00A0':ch;
        s.style.cssText='display:inline-block;opacity:0;transition:text-shadow .35s';
        el.appendChild(s);
        const d=Math.random()*600+i*30;
        setTimeout(()=>{
            s.style.opacity='.8'; s.style.textShadow='0 0 20px #ff3300';
            setTimeout(()=>{s.style.opacity='.1';s.style.textShadow='none'},65);
            setTimeout(()=>{s.style.opacity='.92';s.style.textShadow='0 0 14px #ff3300'},130);
            setTimeout(()=>{s.style.opacity='.28'},195);
            setTimeout(()=>{s.style.opacity='1';s.style.textShadow='0 0 7px rgba(200,25,0,.25)'},280);
        },d);
    });
}
