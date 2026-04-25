"use client";

import { useEffect } from "react";
import Script from "next/script";

const BROCHURE_HTML = `
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
:root { --bg:#0A0C10; --surface:rgba(255,255,255,0.04); --border:rgba(255,255,255,0.07); --white:#F2F0ED; --dim:rgba(242,240,237,0.45); --dimmer:rgba(242,240,237,0.22); --lavender:#FF6B2B; --teal:#38d9b4; --lav2:#FF9A70; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--white); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; cursor: none; }
body::before { content:''; position:fixed; inset:0; background-image: linear-gradient(rgba(255,107,43,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,43,0.03) 1px, transparent 1px); background-size:60px 60px; pointer-events:none; z-index:0; }
#bg-canvas { position:fixed; top:0; left:0; width:100%; height:100%; z-index:1; display:block; }
#cursor { position:fixed; width:10px; height:10px; background:var(--lavender); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition: width .2s, height .2s; mix-blend-mode:screen; }
#cursor-ring { position:fixed; width:36px; height:36px; border:1px solid rgba(255,107,43,0.4); border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left .1s ease, top .1s ease, width .3s, height .3s; }
nav { position:fixed; top:0; left:0; right:0; z-index:500; display:flex; justify-content:space-between; align-items:center; padding:1.4rem 3.5rem; background:linear-gradient(to bottom, rgba(10,12,16,0.95), transparent); transition:background .3s, backdrop-filter .3s; }
nav.scrolled { background:rgba(10,12,16,0.92); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); }
.nav-logo { font-family:'Syne', sans-serif; font-size:1rem; font-weight:700; letter-spacing:.04em; text-decoration:none; color:var(--white); }
.nav-logo span { color:var(--lavender); }
.nav-links { display:flex; gap:2rem; list-style:none; }
.nav-links a { font-size:.7rem; letter-spacing:.12em; text-transform:uppercase; text-decoration:none; color:var(--dim); transition:color .2s; }
.nav-links a:hover { color:var(--lavender); }
.nav-cta { font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; text-decoration:none; color:var(--bg); background:linear-gradient(135deg, var(--lavender), var(--teal)); padding:.55rem 1.4rem; transition:opacity .2s; }
.nav-cta:hover { opacity:.85; }
section { position:relative; z-index:10; }
.section-inner { padding:8.5rem 3.5rem 7rem; }
.eyebrow { font-size:.62rem; letter-spacing:.22em; text-transform:uppercase; color:var(--teal); margin-bottom:1rem; display:flex; align-items:center; gap:.7rem; }
.eyebrow::before { content:''; width:18px; height:1px; background:var(--teal); display:inline-block; }
.eyebrow.lav { color:var(--lavender); }
.eyebrow.lav::before { background:var(--lavender); }
.sec-title { font-family:'Syne', sans-serif; font-size:clamp(2rem,4vw,3.4rem); font-weight:800; letter-spacing:-.03em; line-height:1.05; margin-bottom:1.5rem; }
.sec-title .grad { background:linear-gradient(135deg,var(--lavender),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.sec-body { font-size:.95rem; line-height:1.85; color:var(--dim); max-width:760px; }
.hero-btns { display:flex; gap:1.2rem; align-items:center; margin-top:1.5rem; }
.btn-grad { font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; text-decoration:none; color:var(--bg); background:linear-gradient(135deg, var(--lavender), var(--teal)); padding:.85rem 2rem; transition: opacity .2s, transform .2s; display:inline-block; }
.btn-grad:hover { opacity:.88; transform:translateY(-2px); }
.btn-ghost { font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; text-decoration:none; color:var(--dim); border-bottom:1px solid var(--border); padding-bottom:2px; }
.magnus-cards,.projects-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:3.25rem; }
.magnus-card,.project-card { background:var(--surface); border:1px solid var(--border); padding:2.5rem; position:relative; overflow:hidden; }
.mc-label { font-size:.58rem; color:var(--lavender); margin-bottom:1.2rem; letter-spacing:.14em; text-transform:uppercase; }
.mc-title,.project-title { font-family:'Syne', sans-serif; }
.mc-title { font-size:1.6rem; font-weight:800; margin-bottom:.7rem; }
.mc-desc,.project-desc { font-size:.85rem; line-height:1.75; color:var(--dim); }
.news-list { list-style:none; display:flex; flex-direction:column; gap:.9rem; margin-top:1.25rem; }
.project-tech { display:flex; gap:.5rem; flex-wrap:wrap; margin-top:1rem; }
.tech-tag { display:inline-block; border:1px solid var(--border); padding:.3rem .8rem; color:var(--teal); letter-spacing:.14em; text-transform:uppercase; font-size:.62rem; }
.dash-metrics{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:1.2rem}
.dash-card{border:1px solid var(--border);background:linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));padding:1.1rem 1.1rem 1rem;position:relative;overflow:hidden}
.dash-k{font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--dimmer);margin-bottom:.35rem}
.dash-v{font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.6rem}
.dash-svg{width:100%;height:44px;display:block}
.reveal { opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
.reveal.on { opacity:1; transform:translateY(0); }
.reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}.reveal-d4{transition-delay:.4s}
@media (max-width:980px){
  .nav-links{display:none;}
  nav,.section-inner{padding-left:1.25rem;padding-right:1.25rem;}
  .magnus-cards,.projects-grid{grid-template-columns:1fr;}
  body{cursor:auto;}
  #cursor,#cursor-ring{display:none;}
}
</style>
<canvas id="bg-canvas"></canvas><div id="cursor"></div><div id="cursor-ring"></div>
<nav id="nav"><a href="/" class="nav-logo">DBP<span>A</span></a><ul class="nav-links"><li><a href="/">Home</a></li><li><a href="#brochure">Brochure</a></li></ul><a href="/" class="nav-cta">Return</a></nav>

<section id="brochure">
  <div class="section-inner">
    <p class="eyebrow lav reveal">Brochure</p>
    <h1 class="sec-title reveal">Sell the <span class="grad">outcome</span>, then ship the system.</h1>
    <p class="sec-body reveal">A visual, executive-ready snapshot of the solutions I build: industrial AI that plugs into operations and finance, autonomous robotics with industrial allies, end-to-end agents, forecasting, decision dashboards, and aerospace education programs.</p>
    <div class="hero-btns reveal" style="opacity:1;animation:none;">
      <a href="/" class="btn-ghost">Back to website</a>
      <a href="/#contact" class="btn-grad">Contact</a>
    </div>

    <div class="magnus-cards" style="margin-top:3.25rem">
      <div class="magnus-card reveal reveal-d1">
        <div class="mc-label">1 · SCOPE</div>
        <div class="mc-title">Industrial AI that runs the business (not just the plant)</div>
        <div class="mc-desc">SCOPE is a multi-agent industrial AI system that discovers environments, builds a living knowledge graph, and executes work across <b>operations</b>, <b>maintenance</b>, <b>quality</b>, and <b>finance</b>. It reads live signals, explains what matters, and delivers actions and reports automatically.</div>
        <ul class="news-list">
          <li><b>Autonomous discovery</b>: assets, variables, screens, and relationships — without hardcoding.</li>
          <li><b>Memory + rules</b>: semantic/episodic/procedural persistence to improve every session.</li>
          <li><b>From anomaly → plan</b>: detect, reason, recommend, and escalate with traceability.</li>
        </ul>
        <div class="hero-btns" style="margin-top:1.35rem;opacity:1;animation:none;">
          <a href="https://youtu.be/tEk-KDUBvTs?si=JiwbkbPZTUJmufts" class="btn-grad" target="_blank" rel="noreferrer">Watch demo</a>
          <a href="/#contact" class="btn-ghost">Deploy in my operation</a>
        </div>
      </div>

      <div class="magnus-card reveal reveal-d2">
        <div class="mc-label">2 · NONHUMAN</div>
        <div class="mc-title">Autonomous robotics, built with industrial partners</div>
        <div class="mc-desc">NONHUMAN is an embodied AI and robotics research + deployment ecosystem. Today it is in collaboration with <b>SIEMENS</b>, <b>DINAUT</b>, and <b>GLEXCO</b> to take autonomy from prototypes to production environments.</div>
        <ul class="news-list">
          <li><b>Embodied AI</b>: perception, control, edge AI, safety-first execution.</li>
          <li><b>Integration</b>: industrial stacks, data pipelines, and real constraints.</li>
          <li><b>Deployment models</b>: pilots, managed rollouts, and scalable operations.</li>
        </ul>
        <div class="hero-btns" style="margin-top:1.35rem;opacity:1;animation:none;">
          <a href="https://nonhuman.site/" class="btn-grad" target="_blank" rel="noreferrer">nonhuman.site</a>
          <a href="/#contact" class="btn-ghost">Discuss a pilot</a>
        </div>
      </div>
    </div>

    <div class="projects-grid" style="margin-top:1.5rem">
      <div class="project-card reveal reveal-d1">
        <div class="mc-label">3 · End-to-End Agents</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Agents that execute — not chat</div>
        <div class="project-desc">The core value is <b>throughput</b>: agents that understand context, follow business rules, and reliably execute tasks across tools (APIs, DBs, docs, email, calendars). Less busywork. Faster cycles. Fewer errors.</div>
        <div class="project-tech">
          <span class="tech-tag">Orchestration</span><span class="tech-tag">Rules</span><span class="tech-tag">Memory</span><span class="tech-tag">Audit trail</span>
        </div>
      </div>

      <div class="project-card reveal reveal-d2">
        <div class="mc-label">4 · Forecast</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Plan with confidence (demand, capacity, cash)</div>
        <div class="project-desc">Forecast.com turns historical data into actionable projections: scenarios, trends, and planning horizons you can trust — built for operational and commercial decisions.</div>
        <div class="hero-btns" style="margin-top:1.2rem;opacity:1;animation:none;">
          <a href="https://magnusgc.consulting/productos/forecast" class="btn-grad" target="_blank" rel="noreferrer">Forecast.com</a>
          <a href="/#contact" class="btn-ghost">Evaluate with my data</a>
        </div>
      </div>

      <div class="project-card reveal reveal-d3">
        <div class="mc-label">5 · Dashboards</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Decision dashboards with real metrics</div>
        <div class="project-desc">Dashboards designed for decisions: KPI hierarchy, alerts, drill-down, and executive summaries. Not “pretty charts” — operational clarity.</div>
        <div class="dash-metrics">
          <div class="dash-card">
            <div class="dash-k">Availability</div><div class="dash-v">97.2%</div>
            <svg viewBox="0 0 140 44" class="dash-svg" aria-hidden="true">
              <path d="M2 34 C 18 10, 32 36, 48 18 S 82 30, 98 16 S 124 22, 138 8" fill="none" stroke="rgba(56,217,180,.9)" stroke-width="2.2"/>
              <path d="M2 42 L2 34 C 18 10, 32 36, 48 18 S 82 30, 98 16 S 124 22, 138 8 L138 42 Z" fill="rgba(56,217,180,.10)"/>
            </svg>
          </div>
          <div class="dash-card">
            <div class="dash-k">MAPE</div><div class="dash-v">&lt; 40%</div>
            <svg viewBox="0 0 140 44" class="dash-svg" aria-hidden="true">
              <rect x="8" y="20" width="14" height="18" fill="rgba(255,107,43,.22)"/>
              <rect x="30" y="14" width="14" height="24" fill="rgba(255,107,43,.28)"/>
              <rect x="52" y="10" width="14" height="28" fill="rgba(255,107,43,.38)"/>
              <rect x="74" y="18" width="14" height="20" fill="rgba(56,217,180,.35)"/>
              <rect x="96" y="8" width="14" height="30" fill="rgba(56,217,180,.48)"/>
              <rect x="118" y="12" width="14" height="26" fill="rgba(56,217,180,.30)"/>
            </svg>
          </div>
          <div class="dash-card">
            <div class="dash-k">Alerts</div><div class="dash-v">Live</div>
            <svg viewBox="0 0 140 44" class="dash-svg" aria-hidden="true">
              <path d="M10 34 H46" stroke="rgba(242,240,237,.20)" stroke-width="2"/>
              <path d="M10 24 H86" stroke="rgba(242,240,237,.18)" stroke-width="2"/>
              <path d="M10 14 H118" stroke="rgba(242,240,237,.16)" stroke-width="2"/>
              <circle cx="108" cy="14" r="3.2" fill="rgba(56,217,180,.95)"/>
              <circle cx="78" cy="24" r="3.2" fill="rgba(255,107,43,.95)"/>
              <circle cx="38" cy="34" r="3.2" fill="rgba(56,217,180,.75)"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="project-card reveal reveal-d4">
        <div class="mc-label">6 · GIA PUCP</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Aerospace engineering + education that funds itself</div>
        <div class="project-desc">A commercial model around an educational rocketry kit (primary / secondary / higher-ed) to sustain the flagship program (<b>KUNTUR</b>) — with pilots, sponsorships, and institutional partnerships.</div>
        <div class="hero-btns" style="margin-top:1.2rem;opacity:1;animation:none;">
          <a href="https://www.giaperu.space/" class="btn-grad" target="_blank" rel="noreferrer">giaperu.space</a>
          <a href="/#contact" class="btn-ghost">Partner / sponsor</a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const BROCHURE_JS = `
'use strict';
if (window.__dbpaBrochureInit) return;
window.__dbpaBrochureInit = true;

const cursorEl = document.getElementById('cursor');
const ringEl = document.getElementById('cursor-ring');
document.addEventListener('mousemove', function(e) {
  if (!cursorEl || !ringEl) return;
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
  ringEl.style.left   = e.clientX + 'px';
  ringEl.style.top    = e.clientY + 'px';
});
document.querySelectorAll('a,button,input').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    if (!cursorEl || !ringEl) return;
    cursorEl.style.width = '5px'; cursorEl.style.height = '5px';
    ringEl.style.width = '54px'; ringEl.style.height = '54px';
  });
  el.addEventListener('mouseleave', function() {
    if (!cursorEl || !ringEl) return;
    cursorEl.style.width = '10px'; cursorEl.style.height = '10px';
    ringEl.style.width = '36px'; ringEl.style.height = '36px';
  });
});

window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

(function() {
  var THREE = window.THREE;
  if (!THREE) return;
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0A0C10, 1);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  var tgX = 0, tgY = 0, camX = 0, camY = 0;
  document.addEventListener('mousemove', function(e) {
    tgX = (e.clientX / window.innerWidth  - 0.5) * 2;
    tgY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function makeCloud(count, radius, spread, hex, ptSize, opacity) {
    var geo  = new THREE.BufferGeometry();
    var pos  = new Float32Array(count * 3);
    var cols = new Float32Array(count * 3);
    var col  = new THREE.Color(hex);
    for (var i = 0; i < count; i++) {
      var r  = Math.random() * radius;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(ph) * Math.cos(th) + (Math.random() - 0.5) * spread;
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(th) + (Math.random() - 0.5) * spread;
      pos[i*3+2] = r * Math.cos(ph)                + (Math.random() - 0.5) * spread;
      var b = 0.35 + Math.random() * 0.65;
      cols[i*3] = col.r * b; cols[i*3+1] = col.g * b; cols[i*3+2] = col.b * b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
    var mat = new THREE.PointsMaterial({
      size: ptSize, vertexColors: true, transparent: true, opacity: opacity,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geo, mat);
  }

  var cloud1 = makeCloud(6500, 24, 2,   0xFF6B2B, 0.050, 0.66);
  var cloud2 = makeCloud(3800, 18, 1.5, 0x38d9b4, 0.040, 0.58);
  var cloud3 = makeCloud(2200, 12, 1.0, 0xFF9A70, 0.035, 0.48);
  scene.add(cloud1, cloud2, cloud3);

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.007;
    camX += (tgX - camX) * 0.03;
    camY += (tgY - camY) * 0.03;
    camera.position.x = camX * 2.5;
    camera.position.y = -camY * 1.8;
    camera.lookAt(0, 0, 0);
    cloud1.rotation.y = t * 0.05;
    cloud2.rotation.y = -t * 0.035; cloud2.rotation.x = t * 0.015;
    cloud3.rotation.z = t * 0.025;
    renderer.render(scene, camera);
  }
  animate();
})();

if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { revealObserver.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('on'); });
}
`;

export default function BrochurePage() {
  useEffect(() => {
    let cancelled = false;
    (window as any).__dbpaBrochureInit = false;
    const init = () => {
      if (cancelled) return;
      const w = window as any;
      if (!w.THREE) return;
      // eslint-disable-next-line no-new-func
      new Function(BROCHURE_JS)();
    };
    const t = setInterval(() => {
      if ((window as any).THREE) {
        init();
        clearInterval(t);
      }
    }, 100);
    return () => {
      cancelled = true;
      clearInterval(t);
      (window as any).__dbpaBrochureInit = false;
    };
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      <div dangerouslySetInnerHTML={{ __html: BROCHURE_HTML }} />
    </>
  );
}

