"use client";

import { useEffect } from "react";
import Script from "next/script";

const BROCHURE_HTML = `
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
:root { --bg:#0A0C10; --surface:rgba(255,255,255,0.04); --border:rgba(255,255,255,0.07); --white:#F2F0ED; --dim:rgba(242,240,237,0.45); --dimmer:rgba(242,240,237,0.22); --lavender:#FF6B2B; --teal:#38d9b4; --lav2:#FF9A70; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--white); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; cursor: none; }
::selection { background: rgba(56,217,180,0.18); color: var(--white); }
::-moz-selection { background: rgba(56,217,180,0.18); color: var(--white); }
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
.nav-right{display:flex;align-items:center;gap:.75rem}
.lang-switch{display:flex;align-items:center;gap:.3rem;border:1px solid var(--border);background:rgba(255,255,255,0.02);padding:.2rem}
.lang-btn{border:0;background:transparent;color:var(--dim);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;padding:.28rem .5rem;cursor:pointer}
.lang-btn.active{color:var(--white);background:rgba(255,107,43,0.18)}
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
.contact-cards{display:grid;grid-template-columns:1fr;gap:.9rem;margin:1.35rem 0 0;max-width:560px}
.contact-card{display:flex;align-items:center;gap:1rem;padding:1rem 1.15rem;border:1px solid rgba(255,255,255,0.09);background:linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02));text-decoration:none;position:relative;overflow:hidden}
.contact-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 50%, rgba(56,217,180,0.10), transparent 55%), radial-gradient(circle at 85% 40%, rgba(255,107,43,0.10), transparent 58%);filter:blur(18px);opacity:.9;pointer-events:none}
.contact-card:hover{border-color:rgba(56,217,180,0.25);transform:translateY(-1px)}
.contact-ic{position:relative;z-index:2;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;border:1px solid rgba(255,255,255,0.10);background:rgba(10,12,16,0.35)}
.contact-ic svg{width:20px;height:20px;display:block}
.contact-txt{position:relative;z-index:2;display:flex;flex-direction:column;gap:.18rem;text-align:left}
.contact-h{font-family:'Syne',sans-serif;font-weight:800;font-size:.92rem;color:rgba(242,240,237,.92)}
.contact-s{font-size:.84rem;color:rgba(242,240,237,.48);letter-spacing:.01em}
.contact-card.wa{border-color:rgba(56,217,180,0.18)}
.contact-card.wa .contact-ic{border-color:rgba(56,217,180,0.22);background:rgba(56,217,180,0.06)}
.contact-card.li{border-color:rgba(150,110,255,0.22)}
.contact-card.li .contact-ic{border-color:rgba(150,110,255,0.25);background:rgba(150,110,255,0.08)}
.contact-card.em{border-color:rgba(255,255,255,0.10)}
.contact-card.em .contact-ic{border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.04)}
.magnus-cards,.projects-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:3.25rem; }
.magnus-card,.project-card { background:var(--surface); border:1px solid var(--border); padding:2.5rem; position:relative; overflow:hidden; }
.media-shot{margin-top:1.25rem;border:1px solid rgba(255,255,255,0.10);background:rgba(10,12,16,0.25);padding:.65rem;position:relative;overflow:hidden}
.media-shot::before{content:'';position:absolute;inset:-50% -30%;background:radial-gradient(circle at 35% 45%, rgba(56,217,180,0.12), transparent 48%), radial-gradient(circle at 70% 40%, rgba(255,107,43,0.12), transparent 52%);filter:blur(22px);opacity:.85;pointer-events:none}
.media-shot img{position:relative;z-index:2;width:100%;height:auto;display:block;border:1px solid rgba(255,255,255,0.10);filter:saturate(1.05) contrast(1.02)}
.media-cap{position:relative;z-index:2;margin-top:.65rem;display:flex;justify-content:space-between;gap:1rem;align-items:center;font-size:.66rem;color:rgba(242,240,237,.46);letter-spacing:.08em}
.media-cap b{color:rgba(242,240,237,.78);font-weight:600}
.mc-label { font-size:.58rem; color:var(--lavender); margin-bottom:1.2rem; letter-spacing:.14em; text-transform:uppercase; }
.mc-title,.project-title { font-family:'Syne', sans-serif; }
.mc-title { font-size:1.6rem; font-weight:800; margin-bottom:.7rem; }
.mc-desc,.project-desc { font-size:.85rem; line-height:1.75; color:var(--dim); }
.news-list { list-style:none; display:flex; flex-direction:column; gap:.9rem; margin-top:1.25rem; }
.project-tech { display:flex; gap:.5rem; flex-wrap:wrap; margin-top:1rem; }
.tech-tag { display:inline-block; border:1px solid var(--border); padding:.3rem .8rem; color:var(--teal); letter-spacing:.14em; text-transform:uppercase; font-size:.62rem; }
.scope-dash{margin-top:1.25rem;border:1px solid rgba(255,255,255,0.09);background:linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));position:relative;overflow:hidden}
.scope-dash::before{content:'';position:absolute;inset:-40% -20%;background:radial-gradient(circle at 30% 30%, rgba(56,217,180,0.12), transparent 40%), radial-gradient(circle at 70% 40%, rgba(255,107,43,0.14), transparent 44%);filter:blur(24px);opacity:.9;pointer-events:none}
.scope-top{position:relative;z-index:2;display:flex;justify-content:space-between;gap:1.25rem;align-items:flex-start;padding:1.2rem 1.2rem .95rem;border-bottom:1px solid rgba(255,255,255,0.07)}
.scope-title{font-family:'Syne',sans-serif;font-weight:800;font-size:.92rem;letter-spacing:.04em}
.scope-sub{margin-top:.3rem;font-size:.72rem;color:rgba(242,240,237,.42);line-height:1.5}
.scope-chips{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:flex-end}
.scope-chip{font-size:.56rem;letter-spacing:.14em;text-transform:uppercase;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.02);color:rgba(242,240,237,.55);padding:.35rem .55rem}
.scope-chip.ok{border-color:rgba(56,217,180,0.24);color:rgba(56,217,180,.92);background:rgba(56,217,180,0.06)}
.scope-chip.warn{border-color:rgba(255,107,43,0.28);color:rgba(255,107,43,.92);background:rgba(255,107,43,0.06)}
.scope-body{position:relative;z-index:2;padding:1.15rem 1.2rem 1.2rem}
.scope-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.scope-kpi{border:1px solid rgba(255,255,255,0.09);background:rgba(10,12,16,0.25);padding:.95rem .95rem .85rem;position:relative;overflow:hidden}
.scope-kpi::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg, rgba(56,217,180,0.10), transparent 55%);opacity:.55;pointer-events:none}
.scope-k{position:relative;z-index:2;font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,240,237,.36);margin-bottom:.3rem}
.scope-v{position:relative;z-index:2;font-family:'Syne',sans-serif;font-size:1.35rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.55rem}
.scope-meta{position:relative;z-index:2;font-size:.70rem;color:rgba(242,240,237,.46);display:flex;gap:.6rem;flex-wrap:wrap}
.scope-dot{display:inline-flex;align-items:center;gap:.35rem}
.scope-dot i{width:6px;height:6px;border-radius:50%;background:rgba(56,217,180,.9);display:inline-block;box-shadow:0 0 18px rgba(56,217,180,.35)}
.scope-dot.warn i{background:rgba(255,107,43,.9);box-shadow:0 0 18px rgba(255,107,43,.35)}
.scope-svg{position:relative;z-index:2;width:100%;height:44px;display:block}
.scope-row{margin-top:1rem;border-top:1px solid rgba(255,255,255,0.07);padding-top:1rem;display:grid;grid-template-columns:1.25fr .75fr;gap:1rem}
.scope-table{border:1px solid rgba(255,255,255,0.09);background:rgba(10,12,16,0.22);padding:.9rem}
.scope-h{font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,240,237,.34);margin-bottom:.65rem}
.scope-line{display:flex;justify-content:space-between;gap:1rem;font-size:.76rem;color:rgba(242,240,237,.52);padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,0.06)}
.scope-line:last-child{border-bottom:0}
.scope-line b{font-weight:600;color:rgba(242,240,237,.82)}
.scope-spark{border:1px solid rgba(255,255,255,0.09);background:rgba(10,12,16,0.22);padding:.9rem;position:relative;overflow:hidden}
.scope-spark::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 45% 40%, rgba(255,154,112,0.11), transparent 55%);filter:blur(18px);opacity:.9;pointer-events:none}
.scope-bars{position:relative;z-index:2;display:flex;align-items:flex-end;gap:7px;height:110px;margin-top:.6rem}
.scope-bar{width:10px;background:linear-gradient(180deg, rgba(56,217,180,.85), rgba(56,217,180,.12));border:1px solid rgba(56,217,180,0.22)}
.scope-bar.alt{background:linear-gradient(180deg, rgba(255,107,43,.82), rgba(255,107,43,.10));border-color:rgba(255,107,43,0.24)}
.scope-foot{position:relative;z-index:2;margin-top:.75rem;font-size:.68rem;color:rgba(242,240,237,.42);line-height:1.55}
.scope-foot b{color:rgba(242,240,237,.78)}
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
<nav id="nav"><a href="/" class="nav-logo">DBP<span>A</span></a><ul class="nav-links"><li><a href="/">Home</a></li><li><a href="#brochure">Brochure</a></li></ul><div class="nav-right"><div class="lang-switch" aria-label="Language switcher"><button class="lang-btn active" data-lang="en" type="button">EN</button><button class="lang-btn" data-lang="es" type="button">ES</button></div><a href="/" class="nav-cta">Return</a></div></nav>

<section id="brochure">
  <div class="section-inner">
    <p class="eyebrow lav reveal">Brochure</p>
    <h1 class="sec-title reveal">Sell the <span class="grad">outcome</span>, then ship the system.</h1>
    <p class="sec-body reveal">A visual, executive-ready snapshot of the solutions I build: industrial AI that plugs into operations and finance, autonomous robotics with industrial allies, end-to-end agents, forecasting, decision dashboards, and aerospace education programs.</p>
    <div class="hero-btns reveal" style="opacity:1;animation:none;">
      <a href="/" class="btn-ghost">Back to website</a>
      <a href="/#contact" class="btn-grad">Contact</a>
    </div>
    <div class="contact-cards reveal">
      <a class="contact-card wa" href="https://wa.me/51955256450" target="_blank" rel="noreferrer">
        <div class="contact-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3.5C7.31 3.5 3.5 7.09 3.5 11.5c0 1.63.52 3.16 1.41 4.44L4 21l5.26-1.7c1.18.55 2.5.86 3.94.86 4.69 0 8.5-3.59 8.5-8s-3.81-8-8.7-8z" stroke="rgba(56,217,180,.95)" stroke-width="1.5" opacity=".95"/>
            <path d="M9.2 9.1c.18-.42.37-.42.55-.42h.46c.15 0 .35.05.53.28.18.23.7.86.7 2.06 0 1.2-.73 2.36-.84 2.52-.11.16-.16.37.02.7.18.33.8 1.27 1.74 2.06 1.21 1.01 2.23 1.33 2.56 1.47.33.14.52.12.71-.07.19-.18.82-.95 1.04-1.27.22-.33.44-.28.73-.16.29.12 1.84.86 2.15 1.02.31.16.52.23.6.35.07.12.07.7-.17 1.38-.24.67-1.39 1.28-1.95 1.37-.51.08-1.16.12-1.87-.11-.43-.14-.98-.32-1.69-.62-2.97-1.28-4.9-4.41-5.05-4.62-.14-.21-1.2-1.6-1.2-3.05 0-1.45.78-2.17.95-2.38z" fill="rgba(56,217,180,.92)"/>
          </svg>
        </div>
        <div class="contact-txt">
          <div class="contact-h">WhatsApp</div>
          <div class="contact-s">+51 955 256 450</div>
        </div>
      </a>

      <a class="contact-card li" href="https://www.linkedin.com/in/diego-pozo-abregu/" target="_blank" rel="noreferrer">
        <div class="contact-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6.6 9.3H3.9V20h2.7V9.3z" fill="rgba(196,178,255,.95)"/>
            <path d="M5.25 8.1c.92 0 1.66-.73 1.66-1.62S6.17 4.86 5.25 4.86c-.92 0-1.66.73-1.66 1.62S4.33 8.1 5.25 8.1z" fill="rgba(196,178,255,.95)"/>
            <path d="M20.2 20h-2.7v-5.6c0-1.34-.02-3.06-1.93-3.06-1.93 0-2.22 1.45-2.22 2.96V20h-2.7V9.3h2.6v1.46h.04c.37-.68 1.3-1.4 2.67-1.4 2.86 0 3.39 1.82 3.39 4.18V20z" fill="rgba(196,178,255,.95)"/>
          </svg>
        </div>
        <div class="contact-txt">
          <div class="contact-h">LinkedIn</div>
          <div class="contact-s">linkedin.com</div>
        </div>
      </a>

      <a class="contact-card em" href="mailto:diegopozo@beyondhuman.services">
        <div class="contact-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4.5 7.5h15v9.5c0 1.1-.9 2-2 2h-11c-1.1 0-2-.9-2-2V7.5z" stroke="rgba(242,240,237,.85)" stroke-width="1.5"/>
            <path d="M5.2 8.2l6.4 5.1c.3.24.8.24 1.1 0l6.1-5" stroke="rgba(242,240,237,.70)" stroke-width="1.5" opacity=".95"/>
          </svg>
        </div>
        <div class="contact-txt">
          <div class="contact-h">Email</div>
          <div class="contact-s">diegopozo@beyondhuman.services</div>
        </div>
      </a>
    </div>

    <div class="magnus-cards" style="margin-top:3.25rem">
      <div class="magnus-card reveal reveal-d1">
        <div class="mc-label">1 · SCOPE</div>
        <div class="mc-title">Industrial AI that runs the business (not just the plant)</div>
        <div class="mc-desc" data-i18n-key="scope_desc">SCOPE is a multi-agent industrial AI system that discovers environments, builds a living knowledge graph, and executes work across <b>operations</b>, <b>maintenance</b>, <b>quality</b>, and <b>finance</b>. It reads live signals, explains what matters, and delivers actions and reports automatically.</div>
        <div class="media-shot">
          <img src="/brochure/scope.jpg" alt="SCOPE demo preview" loading="lazy" />
          <div class="media-cap"><span data-i18n-key="scope_cap_1"><b>SCOPE</b> · Demo snapshot</span><span data-i18n-key="scope_cap_2">From the live demo video</span></div>
        </div>
        <ul class="news-list">
          <li data-i18n-key="scope_b1"><b>Autonomous discovery</b>: assets, variables, screens, and relationships — without hardcoding.</li>
          <li data-i18n-key="scope_b2"><b>Memory + rules</b>: semantic/episodic/procedural persistence to improve every session.</li>
          <li data-i18n-key="scope_b3"><b>From anomaly → plan</b>: detect, reason, recommend, and escalate with traceability.</li>
        </ul>
        <div class="hero-btns" style="margin-top:1.35rem;opacity:1;animation:none;">
          <a href="https://youtu.be/tEk-KDUBvTs?si=JiwbkbPZTUJmufts" class="btn-grad" target="_blank" rel="noreferrer">Watch demo</a>
          <a href="/#contact" class="btn-ghost">Deploy in my operation</a>
        </div>
      </div>

      <div class="magnus-card reveal reveal-d2">
        <div class="mc-label">2 · NONHUMAN</div>
        <div class="mc-title">Autonomous robotics, built with industrial partners</div>
        <div class="mc-desc" data-i18n-key="nonhuman_desc">NONHUMAN is an embodied AI and robotics research + deployment ecosystem. Today it is in collaboration with <b>SIEMENS</b>, <b>DINAUT</b>, and <b>GLEXCO</b> to take autonomy from prototypes to production environments.</div>
        <div class="media-shot">
          <video controls playsinline preload="metadata" style="position:relative;z-index:2;width:100%;height:auto;display:block;border:1px solid rgba(255,255,255,0.10);background:rgba(10,12,16,0.35)">
            <source src="/WhatsApp%20Video%202026-04-25%20at%206.46.30%20PM.mp4" type="video/mp4" />
          </video>
          <div class="media-cap"><span data-i18n-key="nonhuman_cap_1"><b>NONHUMAN</b> · Autonomous robotics</span><span data-i18n-key="nonhuman_cap_2">Field / demo clip</span></div>
        </div>
        <ul class="news-list">
          <li data-i18n-key="nonhuman_b1"><b>Embodied AI</b>: perception, control, edge AI, safety-first execution.</li>
          <li data-i18n-key="nonhuman_b2"><b>Integration</b>: industrial stacks, data pipelines, and real constraints.</li>
          <li data-i18n-key="nonhuman_b3"><b>Deployment models</b>: pilots, managed rollouts, and scalable operations.</li>
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
        <div class="project-desc" data-i18n-key="agents_desc">The core value is <b>throughput</b>: agents that understand context, follow business rules, and reliably execute tasks across tools (APIs, DBs, docs, email, calendars). Less busywork. Faster cycles. Fewer errors.</div>
        <div class="media-shot">
          <img src="/brochure/agents.png" alt="End-to-end agents dashboard screenshot" loading="lazy" />
          <div class="media-cap"><span data-i18n-key="agents_cap_1"><b>Agents</b> · End-to-end execution</span><span data-i18n-key="agents_cap_2">Operational workflow snapshot</span></div>
        </div>
        <div class="project-tech">
          <span class="tech-tag">Orchestration</span><span class="tech-tag">Rules</span><span class="tech-tag">Memory</span><span class="tech-tag">Audit trail</span>
        </div>
      </div>

      <div class="project-card reveal reveal-d2">
        <div class="mc-label">4 · Forecast</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Plan with confidence (demand, capacity, cash)</div>
        <div class="project-desc">Forecast.com turns historical data into actionable projections: scenarios, trends, and planning horizons you can trust — built for operational and commercial decisions.</div>
        <div class="media-shot">
          <img src="/brochure/forecast.png" alt="Forecast dashboard screenshot" loading="lazy" />
          <div class="media-cap"><span data-i18n-key="forecast_cap_1"><b>Forecast</b> · Predictive models</span><span data-i18n-key="forecast_cap_2">Platform UI snapshot</span></div>
        </div>
        <div class="hero-btns" style="margin-top:1.2rem;opacity:1;animation:none;">
          <a href="https://magnusgc.consulting/productos/forecast" class="btn-grad" target="_blank" rel="noreferrer">Forecast.com</a>
          <a href="/#contact" class="btn-ghost">Evaluate with my data</a>
        </div>
      </div>

      <div class="project-card reveal reveal-d3">
        <div class="mc-label">5 · Dashboards</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Decision dashboards with real metrics</div>
        <div class="project-desc">Dashboards designed for decisions: KPI hierarchy, alerts, drill-down, and executive summaries. Not “pretty charts” — operational clarity.</div>
        <div class="scope-dash">
          <div class="scope-top">
            <div>
              <div class="scope-title">SCOPE · Operations Snapshot</div>
              <div class="scope-sub">Live signals → normalized KPIs → actions with traceability.</div>
            </div>
            <div class="scope-chips">
              <span class="scope-chip ok">Stable</span>
              <span class="scope-chip">Shift A</span>
              <span class="scope-chip warn">2 alerts</span>
            </div>
          </div>

          <div class="scope-body">
            <div class="scope-grid">
              <div class="scope-kpi">
                <div class="scope-k">Availability</div>
                <div class="scope-v">97.2%</div>
                <svg viewBox="0 0 140 44" class="scope-svg" aria-hidden="true">
                  <path d="M2 30 C 18 12, 34 34, 50 18 S 84 26, 98 14 S 124 20, 138 10" fill="none" stroke="rgba(56,217,180,.92)" stroke-width="2.2"/>
                  <path d="M2 42 L2 30 C 18 12, 34 34, 50 18 S 84 26, 98 14 S 124 20, 138 10 L138 42 Z" fill="rgba(56,217,180,.10)"/>
                </svg>
                <div class="scope-meta">
                  <span class="scope-dot"><i></i> Trend up</span>
                  <span class="scope-dot warn"><i></i> Micro-stops</span>
                </div>
              </div>

              <div class="scope-kpi">
                <div class="scope-k">Forecast error (MAPE)</div>
                <div class="scope-v">38%</div>
                <svg viewBox="0 0 140 44" class="scope-svg" aria-hidden="true">
                  <path d="M6 36 L20 30 L34 33 L48 24 L62 26 L76 18 L90 22 L104 16 L118 20 L132 14" fill="none" stroke="rgba(255,107,43,.88)" stroke-width="2.2"/>
                  <path d="M6 42 L6 36 L20 30 L34 33 L48 24 L62 26 L76 18 L90 22 L104 16 L118 20 L132 14 L132 42 Z" fill="rgba(255,107,43,.10)"/>
                </svg>
                <div class="scope-meta">
                  <span class="scope-dot warn"><i></i> Needs tuning</span>
                  <span class="scope-dot"><i></i> New data</span>
                </div>
              </div>
            </div>

            <div class="scope-row">
              <div class="scope-table">
                <div class="scope-h">Top drivers (last 6h)</div>
                <div class="scope-line"><span>Line 02 — Speed variance</span><b>+14%</b></div>
                <div class="scope-line"><span>Packaging — Sensor drift</span><b>+9%</b></div>
                <div class="scope-line"><span>Downtime — Changeover</span><b>12 min</b></div>
              </div>

              <div class="scope-spark">
                <div class="scope-h">Throughput (units)</div>
                <div class="scope-bars" aria-hidden="true">
                  <div class="scope-bar" style="height:34%"></div>
                  <div class="scope-bar" style="height:46%"></div>
                  <div class="scope-bar alt" style="height:38%"></div>
                  <div class="scope-bar" style="height:58%"></div>
                  <div class="scope-bar" style="height:72%"></div>
                  <div class="scope-bar alt" style="height:61%"></div>
                  <div class="scope-bar" style="height:79%"></div>
                  <div class="scope-bar" style="height:88%"></div>
                  <div class="scope-bar" style="height:84%"></div>
                </div>
                <div class="scope-foot" data-i18n-key="dash_action"><b>Actionable</b>: auto-generate the shift brief + ticket the top driver.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="project-card reveal reveal-d4">
        <div class="mc-label">6 · GIA PUCP</div>
        <div class="project-title" style="font-size:1.25rem;font-weight:800;margin-bottom:.8rem;">Aerospace engineering + education that funds itself</div>
        <div class="project-desc" data-i18n-key="gia_desc">A commercial model around an educational rocketry kit (primary / secondary / higher-ed) to sustain the flagship program (<b>KUNTUR</b>) — with pilots, sponsorships, and institutional partnerships.</div>
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
    cursorEl.style.width = '8px'; cursorEl.style.height = '8px';
    ringEl.style.width = '58px'; ringEl.style.height = '58px';
    ringEl.style.borderColor = 'rgba(56,217,180,0.55)';
    ringEl.style.boxShadow = '0 0 0 1px rgba(56,217,180,0.14), 0 0 28px rgba(56,217,180,0.16)';
  });
  el.addEventListener('mouseleave', function() {
    if (!cursorEl || !ringEl) return;
    cursorEl.style.width = '10px'; cursorEl.style.height = '10px';
    ringEl.style.width = '36px'; ringEl.style.height = '36px';
    ringEl.style.borderColor = 'rgba(255,107,43,0.4)';
    ringEl.style.boxShadow = 'none';
  });
});

(function() {
  var nav = document.getElementById('nav');
  if (!nav || !cursorEl || !ringEl) return;
  nav.addEventListener('mouseenter', function() {
    ringEl.style.width = '66px'; ringEl.style.height = '66px';
    ringEl.style.borderColor = 'rgba(255,107,43,0.55)';
    ringEl.style.boxShadow = '0 0 0 1px rgba(255,107,43,0.16), 0 0 34px rgba(255,107,43,0.16)';
  });
  nav.addEventListener('mouseleave', function() {
    ringEl.style.width = '36px'; ringEl.style.height = '36px';
    ringEl.style.borderColor = 'rgba(255,107,43,0.4)';
    ringEl.style.boxShadow = 'none';
    cursorEl.style.width = '10px'; cursorEl.style.height = '10px';
  });
})();

window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

(function() {
  var ES = {
    "Home": "Inicio",
    "Brochure": "Brochure",
    "Return": "Volver",
    "Back to website": "Volver al sitio",
    "Contact": "Contacto",
    "WhatsApp": "WhatsApp",
    "LinkedIn": "LinkedIn",
    "Email": "Correo",
    "Sell the outcome, then ship the system.": "Vende el resultado, luego despliega el sistema.",
    "A visual, executive-ready snapshot of the solutions I build: industrial AI that plugs into operations and finance, autonomous robotics with industrial allies, end-to-end agents, forecasting, decision dashboards, and aerospace education programs.": "Una vista ejecutiva, lista para decisión, de las soluciones que construyo: IA industrial conectada a operaciones y finanzas, robótica autónoma con aliados industriales, agentes end-to-end, forecasting, dashboards de decisión y programas de educación aeroespacial.",
    "Industrial AI that runs the business (not just the plant)": "IA industrial que corre el negocio (no solo la planta)",
    "scope_desc": "SCOPE es un sistema de IA industrial multi-agente que descubre entornos, construye un grafo de conocimiento vivo y ejecuta trabajo en <b>operaciones</b>, <b>mantenimiento</b>, <b>calidad</b> y <b>finanzas</b>. Lee señales en vivo, explica lo importante y entrega acciones y reportes automáticamente.",
    "scope_cap_1": "<b>SCOPE</b> · Captura demo",
    "scope_cap_2": "Del video demo en vivo",
    "scope_b1": "<b>Descubrimiento autónomo</b>: activos, variables, pantallas y relaciones — sin hardcodear.",
    "scope_b2": "<b>Memoria + reglas</b>: persistencia semántica/episódica/procedural para mejorar cada sesión.",
    "scope_b3": "<b>De anomalía → plan</b>: detecta, razona, recomienda y escala con trazabilidad.",
    "Watch demo": "Ver demo",
    "Deploy in my operation": "Desplegar en mi operación",
    "Autonomous robotics, built with industrial partners": "Robótica autónoma, construida con aliados industriales",
    "nonhuman_desc": "NONHUMAN es un ecosistema de investigación y despliegue en embodied AI y robótica. Hoy colabora con <b>SIEMENS</b>, <b>DINAUT</b> y <b>GLEXCO</b> para llevar la autonomía de prototipos a entornos de producción.",
    "nonhuman_cap_1": "<b>NONHUMAN</b> · Robótica autónoma",
    "nonhuman_cap_2": "Clip de campo / demo",
    "nonhuman_b1": "<b>Embodied AI</b>: percepción, control, edge AI, ejecución safety-first.",
    "nonhuman_b2": "<b>Integración</b>: stacks industriales, pipelines de datos y restricciones reales.",
    "nonhuman_b3": "<b>Modelos de despliegue</b>: pilotos, rollouts gestionados y operaciones escalables.",
    "Discuss a pilot": "Conversar un piloto",
    "Agents that execute — not chat": "Agentes que ejecutan — no solo conversan",
    "agents_desc": "El valor central es el <b>throughput</b>: agentes que entienden contexto, siguen reglas de negocio y ejecutan tareas de forma confiable entre herramientas (APIs, BD, docs, correo, calendarios). Menos trabajo manual. Ciclos más rápidos. Menos errores.",
    "agents_cap_1": "<b>Agentes</b> · Ejecución end-to-end",
    "agents_cap_2": "Captura de flujo operativo",
    "Plan with confidence (demand, capacity, cash)": "Planifica con confianza (demanda, capacidad, caja)",
    "Forecast.com turns historical data into actionable projections: scenarios, trends, and planning horizons you can trust — built for operational and commercial decisions.": "Forecast.com convierte data histórica en proyecciones accionables: escenarios, tendencias y horizontes de planificación confiables — diseñado para decisiones operativas y comerciales.",
    "forecast_cap_1": "<b>Forecast</b> · Modelos predictivos",
    "forecast_cap_2": "Captura de la plataforma",
    "Evaluate with my data": "Evaluar con mis datos",
    "Decision dashboards with real metrics": "Dashboards de decisión con métricas reales",
    "Dashboards designed for decisions: KPI hierarchy, alerts, drill-down, and executive summaries. Not “pretty charts” — operational clarity.": "Dashboards diseñados para decidir: jerarquía de KPIs, alertas, drill-down y resúmenes ejecutivos. No “gráficas bonitas” — claridad operativa.",
    "SCOPE · Operations Snapshot": "SCOPE · Snapshot Operacional",
    "Live signals → normalized KPIs → actions with traceability.": "Señales en vivo → KPIs normalizados → acciones con trazabilidad.",
    "Stable": "Estable",
    "Shift A": "Turno A",
    "2 alerts": "2 alertas",
    "Availability": "Disponibilidad",
    "Trend up": "Tendencia al alza",
    "Micro-stops": "Micro-paradas",
    "Forecast error (MAPE)": "Error de pronóstico (MAPE)",
    "Needs tuning": "Requiere ajuste",
    "New data": "Data nueva",
    "Top drivers (last 6h)": "Principales drivers (últimas 6h)",
    "Line 02 — Speed variance": "Línea 02 — Varianza de velocidad",
    "Packaging — Sensor drift": "Empaque — Deriva de sensor",
    "Downtime — Changeover": "Paradas — Changeover",
    "Throughput (units)": "Throughput (unid.)",
    "dash_action": "<b>Accionable</b>: auto-generar el brief del turno + ticketear el driver principal.",
    "Aerospace engineering + education that funds itself": "Ingeniería aeroespacial + educación que se financia sola",
    "gia_desc": "Un modelo comercial alrededor de un kit educativo de cohetería (primaria / secundaria / superior) para sostener el programa bandera (<b>KUNTUR</b>) — con pilotos, sponsorships y alianzas institucionales.",
    "Partner / sponsor": "Aliado / sponsor"
  };

  function initLanguageSwitcher() {
    var entries = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var raw = node.nodeValue || '';
      var clean = raw.trim();
      if (!clean || !ES[clean]) continue;
      var start = raw.indexOf(clean);
      entries.push({
        node: node,
        before: raw.slice(0, start),
        after: raw.slice(start + clean.length),
        en: clean
      });
    }

    function applyLang(lang) {
      entries.forEach(function(item) {
        var text = lang === 'es' && ES[item.en] ? ES[item.en] : item.en;
        item.node.nodeValue = item.before + text + item.after;
      });

      document.querySelectorAll('[data-i18n-key]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-key');
        if (!key) return;
        if (!el.getAttribute('data-i18n-default')) {
          el.setAttribute('data-i18n-default', el.innerHTML);
        }
        if (lang === 'es' && ES[key]) {
          el.innerHTML = ES[key];
        } else {
          el.innerHTML = el.getAttribute('data-i18n-default') || el.innerHTML;
        }
      });

      document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
      document.documentElement.lang = lang === 'es' ? 'es' : 'en';
      window.__dbpaLang = lang;
      try { localStorage.setItem('dbpa_lang', lang); } catch (_) {}
    }

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var lang = btn.getAttribute('data-lang') === 'es' ? 'es' : 'en';
        applyLang(lang);
      });
    });

    var stored = 'en';
    try { stored = localStorage.getItem('dbpa_lang') || 'en'; } catch (_) {}
    applyLang(stored === 'es' ? 'es' : 'en');
  }

  initLanguageSwitcher();
})();

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

