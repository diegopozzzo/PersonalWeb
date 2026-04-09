"use client";

import { useEffect } from "react";
import Script from "next/script";
import PokemonOverlayBridge from "@/components/PokemonOverlayBridge";

const LANDING_HTML = `
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
:root { --bg:#0A0C10; --bg2:#0d1018; --surface:rgba(255,255,255,0.04); --border:rgba(255,255,255,0.07); --white:#F2F0ED; --dim:rgba(242,240,237,0.45); --dimmer:rgba(242,240,237,0.22); --lavender:#FF6B2B; --teal:#38d9b4; --lav2:#FF9A70; --glow-lav:rgba(255,107,43,0.18); --glow-teal:rgba(56,217,180,0.14); }
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
.nav-right { display:flex; align-items:center; gap:.75rem; }
.lang-switch { display:flex; align-items:center; gap:.3rem; border:1px solid var(--border); background:rgba(255,255,255,0.02); padding:.2rem; }
.lang-btn { border:0; background:transparent; color:var(--dim); font-size:.62rem; letter-spacing:.12em; text-transform:uppercase; padding:.28rem .5rem; cursor:pointer; }
.lang-btn.active { color:var(--white); background:rgba(255,107,43,0.18); }
.nav-cta { font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; text-decoration:none; color:var(--bg); background:linear-gradient(135deg, var(--lavender), var(--teal)); padding:.55rem 1.4rem; transition:opacity .2s; }
.nav-cta:hover { opacity:.85; }
section { position:relative; z-index:10; }
#hero { height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:0 3.5rem; pointer-events:auto; }
#hero a, #hero button { pointer-events:auto; }
.hero-layout { width:100%; display:grid; grid-template-columns:minmax(0, 1fr) minmax(280px, 340px); gap:3.5rem; align-items:end; }
.hero-copy { max-width:760px; }
.hero-tag { font-size:.65rem; letter-spacing:.2em; text-transform:uppercase; color:var(--teal); margin-bottom:1.8rem; opacity:0; animation: fadeUp .7s .3s forwards; display:flex; align-items:center; gap:.8rem; }
.hero-tag::before { content:''; width:28px; height:1px; background:var(--teal); display:inline-block; }
.hero-name { font-family:'Syne', sans-serif; font-size:clamp(2.8rem, 6vw, 5.8rem); font-weight:800; line-height:1.02; letter-spacing:-.03em; margin-bottom:1.2rem; max-width:750px; padding-bottom:.08em; overflow:visible; opacity:0; animation: fadeUp .8s .45s forwards; background:linear-gradient(135deg, var(--white) 40%, var(--lav2) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hero-subtitle { font-size:clamp(.95rem,1.5vw,1.15rem); font-weight:400; color:var(--lavender); margin-bottom:1.5rem; max-width:620px; opacity:0; animation: fadeUp .8s .58s forwards; }
.hero-desc { font-size:.95rem; line-height:1.8; color:var(--dim); max-width:500px; margin-bottom:2.2rem; opacity:0; animation: fadeUp .8s .7s forwards; }
.hero-badges { display:flex; gap:.8rem; margin-bottom:2.5rem; opacity:0; animation: fadeUp .8s .82s forwards; }
.badge { font-size:.6rem; letter-spacing:.14em; text-transform:uppercase; padding:.35rem .9rem; border:1px solid var(--border); background:var(--surface); backdrop-filter:blur(10px); color:var(--dim); }
.badge.lav { border-color:rgba(255,107,43,.3); color:var(--lavender); }
.badge.teal { border-color:rgba(56,217,180,.3); color:var(--teal); }
.hero-btns { display:flex; gap:1.2rem; align-items:center; opacity:0; animation: fadeUp .8s .94s forwards; }
.btn-grad { font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; text-decoration:none; color:var(--bg); background:linear-gradient(135deg, var(--lavender), var(--teal)); padding:.85rem 2rem; transition: opacity .2s, transform .2s; display:inline-block; }
.btn-grad:hover { opacity:.88; transform:translateY(-2px); }
.btn-ghost { font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; text-decoration:none; color:var(--dim); border-bottom:1px solid var(--border); padding-bottom:2px; }
.hero-roles { display:flex; flex-direction:column; gap:1rem; opacity:0; animation: fadeUp .9s .86s forwards; }
.hero-role-link { display:block; text-decoration:none; padding:1rem 1.1rem 1.05rem; border:1px solid rgba(255,255,255,0.08); background:linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); backdrop-filter:blur(18px); transition:transform .2s, border-color .2s, background .2s; }
.hero-role-link:hover { transform:translateY(-2px); border-color:rgba(255,107,43,0.25); background:linear-gradient(180deg, rgba(255,107,43,0.08), rgba(56,217,180,0.04)); }
.hero-role-code { display:block; font-size:.6rem; letter-spacing:.16em; text-transform:uppercase; color:var(--teal); margin-bottom:.45rem; }
.hero-role-company { display:block; font-family:'Syne', sans-serif; font-size:1rem; font-weight:700; letter-spacing:.01em; color:var(--white); margin-bottom:.35rem; }
.hero-role-title { display:block; font-size:.8rem; line-height:1.6; color:var(--dim); }
.scroll-hint { position:absolute; bottom:2.5rem; left:50%; transform:translateX(-50%); font-size:.58rem; letter-spacing:.18em; text-transform:uppercase; color:var(--dimmer); display:flex; flex-direction:column; align-items:center; gap:.6rem; opacity:0; animation: fadeIn 1s 1.6s forwards; }
.scroll-line { width:1px; height:48px; background:linear-gradient(to bottom, var(--lavender), transparent); animation:scrollPulse 2s ease-in-out infinite; }
.section-inner { padding:7rem 3.5rem; }
.eyebrow { font-size:.62rem; letter-spacing:.22em; text-transform:uppercase; color:var(--teal); margin-bottom:1rem; display:flex; align-items:center; gap:.7rem; }
.eyebrow::before { content:''; width:18px; height:1px; background:var(--teal); display:inline-block; }
.eyebrow.lav { color:var(--lavender); }
.eyebrow.lav::before { background:var(--lavender); }
.sec-title { font-family:'Syne', sans-serif; font-size:clamp(2rem,4vw,3.4rem); font-weight:800; letter-spacing:-.03em; line-height:1.05; margin-bottom:1.5rem; }
.sec-title .grad { background:linear-gradient(135deg,var(--lavender),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.sec-body { font-size:.95rem; line-height:1.85; color:var(--dim); max-width:600px; }
#architecture,#nonhuman,#gia,#magnus,#news,#preseed,#projects,#contact { border-top:1px solid var(--border); }
#arch-graph-wrap { position:relative; width:100%; height:560px; margin:3.5rem 0 1.25rem; background:transparent; overflow:visible; cursor:grab; isolation:isolate; }
#arch-graph-wrap::before { content:''; position:absolute; inset:-7% -5%; background:radial-gradient(circle at 50% 56%, rgba(255,107,43,0.15), transparent 24%), radial-gradient(circle at 26% 42%, rgba(56,217,180,0.12), transparent 20%), radial-gradient(circle at 72% 34%, rgba(255,154,112,0.11), transparent 18%); filter:blur(28px); opacity:.95; pointer-events:none; z-index:0; }
#arch-graph-wrap::after { content:''; position:absolute; inset:12% 15%; border-radius:50%; border:1px solid rgba(255,255,255,0.03); box-shadow:0 0 80px rgba(255,107,43,0.08); pointer-events:none; z-index:0; }
#arch-canvas { display:block; width:100%; height:100%; position:relative; z-index:1; }
.graph-badge { position:absolute; bottom:1.2rem; left:1.5rem; font-size:.55rem; letter-spacing:.16em; text-transform:uppercase; color:var(--dimmer); pointer-events:none; z-index:3; text-shadow:0 0 22px rgba(255,107,43,0.22); }
.arch-grid,.magnus-cards,.projects-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); margin-top:1px; }
.magnus-cards,.projects-grid { gap:1.5rem; background:none; margin-top:4rem; }
.arch-card,.magnus-card,.project-card,.nh-visual { background:var(--surface); border:1px solid var(--border); padding:2.5rem; }
.nh-layout { display:grid; grid-template-columns:1.2fr 1fr; gap:5rem; align-items:center; margin-top:4rem; }
.nh-list { list-style:none; display:flex; flex-direction:column; }
.nh-item { padding:1.4rem 0; border-bottom:1px solid var(--border); display:flex; gap:1rem; }
.nh-item:first-child { border-top:1px solid var(--border); }
.nh-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); margin-top:.35rem; flex-shrink:0; }
.nh-item-title { font-size:.9rem; font-weight:500; margin-bottom:.25rem; }
.nh-item-desc { font-size:.8rem; color:var(--dim); line-height:1.6; }
.nh-logo { font-family:'Syne', sans-serif; font-size:2.2rem; font-weight:800; color:var(--teal); }
.nh-tagline { font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); margin-bottom:2rem; }
.nh-stat-label { font-size:.6rem; letter-spacing:.14em; text-transform:uppercase; color:var(--dimmer); margin-bottom:.3rem; }
.nh-stat-val { font-family:'Syne', sans-serif; font-size:1.5rem; font-weight:700; color:var(--teal); }
.magnus-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:4rem; flex-wrap:wrap; gap:2rem; }
.fellow-badge { font-size:.62rem; letter-spacing:.18em; text-transform:uppercase; padding:.4rem 1rem; border:1px solid rgba(255,107,43,.3); color:var(--lavender); background:rgba(255,107,43,.06); }
.news-grid { display:grid; grid-template-columns:1.15fr .85fr; gap:1.5rem; margin-top:4rem; }
.news-card { background:var(--surface); border:1px solid var(--border); padding:2.5rem; }
.news-meta { font-size:.6rem; letter-spacing:.18em; text-transform:uppercase; color:var(--teal); margin-bottom:1rem; }
.news-title { font-family:'Syne', sans-serif; font-size:1.55rem; font-weight:800; line-height:1.12; margin-bottom:1rem; }
.news-list { list-style:none; display:flex; flex-direction:column; gap:.9rem; }
.news-list li { font-size:.85rem; line-height:1.7; color:var(--dim); }
.mc-label,.tech-tag,.step-num,.footer-left,.footer-right a { letter-spacing:.14em; text-transform:uppercase; }
.mc-label { font-size:.58rem; color:var(--lavender); margin-bottom:1.2rem; }
.mc-title,.project-title,.contact-title { font-family:'Syne', sans-serif; }
.mc-title { font-size:1.6rem; font-weight:800; margin-bottom:.7rem; }
.mc-desc,.project-desc,.contact-body,.step-desc { font-size:.85rem; line-height:1.75; color:var(--dim); }
.mc-tag,.tech-tag { display:inline-block; border:1px solid var(--border); padding:.3rem .8rem; color:var(--teal); }
.preseed-layout { display:grid; grid-template-columns:1fr 1.4fr; gap:5rem; align-items:center; margin-top:4rem; }
.preseed-step { display:flex; gap:1.5rem; align-items:flex-start; padding:1.6rem 0; border-bottom:1px solid var(--border); }
.preseed-step:first-child { border-top:1px solid var(--border); }
.preseed-quote { border-left:2px solid var(--lavender); padding-left:2rem; }
.preseed-quote p { font-family:'Syne',sans-serif; font-size:clamp(1.2rem,2.2vw,1.8rem); font-weight:700; line-height:1.35; margin-bottom:1.2rem; }
.preseed-quote span { color:var(--lavender); }
.project-card { position:relative; overflow:hidden; }
.project-tech { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1.2rem; }
.project-arrow { position:absolute; bottom:1.5rem; right:1.5rem; font-sizfe:.8rem; color:var(--lavender); }
.contact-inner { text-align:center; max-width:680px; margin:0 auto; padding:7rem 3.5rem; }
.contact-email { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; color:var(--lavender); text-decoration:none; border-bottom:1px solid rgba(255,107,43,.3); padding-bottom:3px; }
.contact-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,107,43,.08), transparent 70%); }
footer { position:relative; z-index:10; padding:2.5rem 3.5rem; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
.footer-right { display:flex; gap:2rem; }
.glow-divider { width:100%; height:1px; background:linear-gradient(90deg, transparent, var(--lavender), var(--teal), transparent); opacity:.25; }
.reveal { opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
.reveal.on { opacity:1; transform:translateY(0); }
.reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}.reveal-d4{transition-delay:.4s}
@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes scrollPulse { 0%,100%{transform:scaleY(1);opacity:.5} 50%{transform:scaleY(.55);opacity:1} }
@media (max-width:980px){ .nav-links{display:none;} .nh-layout,.preseed-layout,.arch-grid,.magnus-cards,.projects-grid,.hero-layout,.news-grid{grid-template-columns:1fr;} #hero,.section-inner,.contact-inner,nav,footer{padding-left:1.25rem;padding-right:1.25rem;} #hero{height:auto;min-height:100vh;padding-top:8rem;padding-bottom:5rem;} body{cursor:auto;} #cursor,#cursor-ring{display:none;} .nav-right{gap:.45rem;} .lang-btn{padding:.2rem .4rem;} .nav-cta{padding:.5rem .9rem;} #arch-graph-wrap{height:440px;margin:2.5rem 0 1rem;} .hero-layout{gap:2rem;} .scroll-hint{display:none;} }
</style>
<canvas id="bg-canvas"></canvas><div id="cursor"></div><div id="cursor-ring"></div>
<nav id="nav"><a href="#" class="nav-logo">DBP<span>A</span></a><ul class="nav-links"><li><a href="#architecture">Architecture</a></li><li><a href="#nonhuman">NONHUMAN</a></li><li><a href="#gia">GIA PUCP</a></li><li><a href="#magnus">Magnus</a></li><li><a href="#news">News</a></li><li><a href="#preseed">Pre-seed</a></li><li><a href="#projects">Projects</a></li></ul><div class="nav-right"><div class="lang-switch" aria-label="Language switcher"><button class="lang-btn active" data-lang="en" type="button">EN</button><button class="lang-btn" data-lang="es" type="button">ES</button></div><a href="#contact" class="nav-cta">Contact</a></div></nav>
<section id="hero"><div class="hero-layout"><div class="hero-copy"><p class="hero-tag">Smart Solutions · Lima, Peru</p><h1 class="hero-name">Diego Bruno<br>Pozo Abregu</h1><p class="hero-subtitle">Know How</p><p class="hero-desc">I design and connect intelligent systems across AI, robotics, and industrial technology to build robust real-world solutions alongside strategic allies committed to automation and the large-scale expansion of intelligent solutions.</p><div class="hero-btns"><a href="#contact" class="btn-grad">Let's talk</a><a href="#architecture" class="btn-ghost">Explore architecture ↓</a></div></div><div class="hero-roles"><a class="hero-role-link" href="https://humans-machines.nonhuman.site/" target="_blank" rel="noreferrer"><span class="hero-role-code">CEO</span><span class="hero-role-company">BEYONDHUMAN</span><span class="hero-role-title">Chief Executive Officer</span></a><a class="hero-role-link" href="https://nonhuman.site/" target="_blank" rel="noreferrer"><span class="hero-role-code">CBO</span><span class="hero-role-company">NONHUMAN</span><span class="hero-role-title">Chief Business Officer</span></a><a class="hero-role-link" href="https://www.giaperu.space/" target="_blank" rel="noreferrer"><span class="hero-role-code">COO</span><span class="hero-role-company">GIA PUCP</span><span class="hero-role-title">Chief Operating Officer</span></a><a class="hero-role-link" href="https://www.magnusgc.consulting/" target="_blank" rel="noreferrer"><span class="hero-role-code">BDA</span><span class="hero-role-company">MAGNUS G.C. CONSULTING</span><span class="hero-role-title">Business Development Associate</span></a></div></div><div class="scroll-hint"><div class="scroll-line"></div><span>Scroll</span></div></section>
<section id="architecture"><div class="section-inner"><p class="eyebrow lav reveal">Systems Thinking</p><h2 class="sec-title reveal">I build the <span class="grad">connective tissue</span><br>between intelligence and deployment.</h2><p class="sec-body reveal">AI models, hardware systems, human interfaces, and industrial constraints rarely speak the same language. I translate between them — designing coherent architectures that work end-to-end, from model selection to physical deployment.</p><div id="arch-graph-wrap" class="reveal"><canvas id="arch-canvas"></canvas></div></div></section>
<section id="nonhuman"><div class="section-inner"><p class="eyebrow reveal">Understanding New Types of Intelligence</p><h2 class="sec-title reveal"><span class="grad">NONHUMAN</span></h2><div class="nh-layout"><div><p class="sec-body reveal" style="margin-bottom:2.5rem;">NONHUMAN is an embodied AI and robotics research group based in Lima, Peru, building a bridge from frontier research to real deployments.</p><ul class="nh-list"><li class="nh-item reveal reveal-d1"><div class="nh-dot"></div><div><div class="nh-item-title">Research Lab (Core)</div><div class="nh-item-desc">Study and development of machine learning, LLMs, physical AI and autonomous control for humanoid and bimanual systems focused on LATAM realities.</div></div></li><li class="nh-item reveal reveal-d2"><div class="nh-dot"></div><div><div class="nh-item-title">Open Technical Ecosystem</div><div class="nh-item-desc">Active publication and experimentation culture on GitHub and Hugging Face to make advanced AI and robotics research more accessible to builders.</div></div></li><li class="nh-item reveal reveal-d3"><div class="nh-dot"></div><div><div class="nh-item-title">Physical AI + Industrial Integration</div><div class="nh-item-desc">Software and hardware integration through robotic arms, 3D perception, edge AI and industrial stacks, including Siemens-oriented architectures (Jetson edge, OPC UA/PROFINET workflows).</div></div></li><li class="nh-item reveal reveal-d4"><div class="nh-dot"></div><div><div class="nh-item-title">Flagship R&D Directions</div><div class="nh-item-desc">Low-cost robotics training systems (SO-ARM100), LLM architecture exploration (MIND), diffusion modeling work (DDPM), and data-centric learning methods such as reinforcement and imitation learning.</div></div></li><li class="nh-item reveal reveal-d4"><div class="nh-dot"></div><div><div class="nh-item-title">Human & Machines (Commercial Arm)</div><div class="nh-item-desc">Robots as a Service (RaaS) for retail, events, museums and hospitality: deploy robots to capture attention, generate interaction, and convert visits into memorable brand experiences.</div></div></li><li class="nh-item reveal reveal-d4"><div class="nh-dot"></div><div><div class="nh-item-title">RaaS Capabilities and Model</div><div class="nh-item-desc">Remote Presence (teleoperation), Learned Tasks (beta), Coordinated Movement (beta), flexible event/monthly managed services, safety-first deployments, and current early-partner waitlist execution.</div></div></li></ul></div><div class="nh-visual reveal"><div class="nh-logo">NONHUMAN</div><div class="nh-tagline">Embodied AI Research + RaaS Execution</div><div class="nh-stat"><div class="nh-stat-label">Role</div><div class="nh-stat-val">CBO</div></div><div class="nh-stat"><div class="nh-stat-label">Human & Machines Role</div><div class="nh-stat-val" style="font-size:1rem;color:var(--white)">CEO</div></div><div class="nh-stat"><div class="nh-stat-label">Focus</div><div class="nh-stat-val" style="font-size:1rem;color:var(--white)">Research + Physical AI Products</div></div><div class="nh-stat"><div class="nh-stat-label">Trusted By</div><div class="nh-stat-val" style="font-size:1rem;color:var(--white)">PUCP · DINAUT · Ciclos Café · Siemens</div></div></div></div></div></section>
<section id="gia"><div class="section-inner"><div class="magnus-header"><div><p class="eyebrow lav reveal">Aerospace Engineering Group</p><h2 class="sec-title reveal"><span class="grad">GIA PUCP</span></h2><p class="sec-body reveal" style="max-width:620px">GIA PUCP is the Aerospace Engineering Group at PUCP, focused on training engineers and scientists through experimental rocketry and space science research, executing real projects that integrate applied technical formation, academic knowledge production, and technology validation for the Peruvian aerospace ecosystem.</p></div><span class="fellow-badge reveal">COO — GIA PUCP</span></div><div class="magnus-cards"><div class="magnus-card reveal reveal-d1"><div class="mc-label">GIA · Mission</div><div class="mc-title">Experimental Rocketry & Space Science</div><div class="mc-desc">Mission-driven formation, research, and execution through real aerospace projects that connect university learning with validation in the field.</div><span class="mc-tag">PUCP · Aerospace</span></div><div class="magnus-card reveal reveal-d2"><div class="mc-label">GIA · Milestones</div><div class="mc-title">Flight-Validated Milestones</div><div class="mc-desc">At the Latin America Space Challenge, MiSat reached 6th place in satellites and Kuntur 1 reached 7th place in the 500-meter rocketry category.</div><span class="mc-tag">MiSat · Kuntur 1</span></div></div></div></section>
<section id="magnus"><div class="section-inner"><div class="magnus-header"><div><p class="eyebrow lav reveal">Strategic Ecosystem</p><h2 class="sec-title reveal"><span class="grad">Magnus</span></h2><p class="sec-body reveal" style="max-width:480px">A strategic technology consulting ecosystem focused on productivity, consulting, executive training, and AI solutions for companies in Peru. As a Business Development Associate, I support ecosystem growth, partnerships, and commercial expansion.</p></div><span class="fellow-badge reveal">BDA — Magnus G.C. Consulting</span></div><div class="magnus-cards"><div class="magnus-card reveal reveal-d1"><div class="mc-label">Magnus · Venture</div><div class="mc-title">Forecast</div><div class="mc-desc">An AI forecasting platform built for decision systems. Forecast surfaces predictive intelligence across operational, financial, and strategic domains — turning data signals into actionable foresight.</div><span class="mc-tag">AI · Decision Systems</span></div><div class="magnus-card reveal reveal-d2"><div class="mc-label">Magnus · Venture</div><div class="mc-title">Trueke</div><div class="mc-desc">A B2B waste exchange platform enabling circular economy at scale. Trueke connects industrial waste generators with processors and recyclers, creating closed-loop material flows.</div><span class="mc-tag">Circular Economy · B2B</span></div></div></div></section>
<section id="news"><div class="section-inner"><p class="eyebrow lav reveal">News</p><h2 class="sec-title reveal">Recent <span class="grad">updates</span></h2><div class="news-grid"><article class="news-card reveal reveal-d1"><div class="news-meta">Recent Update · GIA PUCP</div><h3 class="news-title">Rocket launch campaign in Chincha</h3><p class="mc-desc">GIA PUCP recently completed a rocket launch in Chincha, adding a new flight-validation milestone to its experimental rocketry roadmap in Peru.</p><p class="mc-desc" style="margin-top:1rem">This update aligns with GIA's mission of training engineers and scientists through real aerospace projects, experimental rocketry, and technology validation from the university.</p><div class="hero-btns reveal" style="margin-top:1.5rem;opacity:1;animation:none;"><a href="https://www.facebook.com/share/p/1CBbTatLGe/" class="btn-grad" target="_blank" rel="noreferrer">Launch post</a><a href="https://www.giaperu.space/" class="btn-ghost" target="_blank" rel="noreferrer">GIA website</a></div></article><article class="news-card reveal reveal-d2"><div class="news-meta">Why it matters</div><ul class="news-list"><li>Validates operations, logistics, and real-world execution beyond lab tests.</li><li>Strengthens the team's mission of applied aerospace training and technology validation.</li><li>Connects university research with field deployment and systems discipline.</li></ul></article></div></div></section>
<section id="preseed"><div class="section-inner"><p class="eyebrow reveal">Early Stage</p><h2 class="sec-title reveal">Pre-seed <span class="grad">architecture</span></h2><div class="preseed-layout"><div class="preseed-steps"><div class="preseed-step reveal reveal-d1"><div class="step-num">01</div><div><div class="step-title">System Design</div><div class="step-desc">Define the architecture before writing a line of code. Which components? Which constraints? What can be deferred?</div></div></div><div class="preseed-step reveal reveal-d2"><div class="step-num">02</div><div><div class="step-title">Stack Selection</div><div class="step-desc">Choose technology that fits the team, the timeline, and the growth trajectory — not just what's fashionable.</div></div></div><div class="preseed-step reveal reveal-d3"><div class="step-num">03</div><div><div class="step-title">MVP Execution</div><div class="step-desc">Ship something real, fast. An MVP that validates assumptions without creating technical debt that kills the next phase.</div></div></div><div class="preseed-step reveal reveal-d4"><div class="step-num">04</div><div><div class="step-title">Scale Readiness</div><div class="step-desc">Build with growth in mind from day one — so that when traction comes, the architecture doesn't become the ceiling.</div></div></div></div><div class="preseed-quote reveal"><p>I help early-stage startups design system architecture and ship <span>robust MVPs</span> — without sacrificing the foundation they'll need to scale.</p><p class="sec-body" style="font-size:.85rem">If you're at the pre-seed stage and need someone who can think at the systems level while also being hands-on with the build — let's talk.</p></div></div></div></section>
<section id="projects"><div class="section-inner"><p class="eyebrow lav reveal">Technical Skills</p><h2 class="sec-title reveal">Selected <span class="grad">skills</span></h2><ul class="nh-list" style="margin-top:4rem;"><li class="nh-item reveal reveal-d1"><div class="nh-dot"></div><div><div class="nh-item-title">Intelligent CRM / ERP Systems</div><div class="nh-item-desc">Custom operational platforms with embedded AI for decision support, automation, and insight generation.</div></div></li><li class="nh-item reveal reveal-d2"><div class="nh-dot"></div><div><div class="nh-item-title">AI Chat Experiences</div><div class="nh-item-desc">Context-aware conversational agents tuned for specific domains, workflows, and organizational knowledge.</div></div></li><li class="nh-item reveal reveal-d3"><div class="nh-dot"></div><div><div class="nh-item-title">Process Automation</div><div class="nh-item-desc">End-to-end workflow automation connecting disparate systems through intelligent orchestration layers.</div></div></li><li class="nh-item reveal reveal-d4"><div class="nh-dot"></div><div><div class="nh-item-title">Asset Tracking — LoRaWAN, BLE, GPS</div><div class="nh-item-desc">Real-time tracking systems for industrial and logistics environments using low-power wireless protocols.</div></div></li></ul></div></section>
<section id="contact" style="position:relative;overflow:hidden;"><div class="contact-glow"></div><div class="contact-inner"><p class="eyebrow reveal" style="justify-content:center">Let's build</p><h2 class="contact-title reveal">Ready to connect<br><span style="background:linear-gradient(135deg,var(--lavender),var(--teal));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">deep systems?</span></h2><p class="contact-body reveal">I'm open to collaboration on deep-tech systems, applied AI, and industrial intelligence — whether you're a startup, a research team, or a company trying to make sense of complex technology.<br><br>Let's talk architecture.</p><a href="mailto:diegopozo@beyondhuman.services" class="contact-email reveal">diegopozo@beyondhuman.services</a><br><br><div class="hero-btns reveal" style="justify-content:center;margin-top:1rem"><a href="mailto:diegopozo@beyondhuman.services" class="btn-grad">Send a message</a></div></div></section>
<div class="glow-divider"></div><footer><div class="footer-left">© 2026 Diego Bruno Pozo Abregu</div><div class="footer-right"><a href="#architecture">Architecture</a><a href="#nonhuman">NONHUMAN</a><a href="#gia">GIA PUCP</a><a href="#magnus">Magnus</a><a href="#news">News</a><a href="#projects">Projects</a></div></footer>
`;

const LANDING_JS = `
'use strict';
if (window.__dbpaLandingInit) return;
window.__dbpaLandingInit = true;

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
  var ES = {
    "Architecture": "Arquitectura",
    "GIA PUCP": "GIA PUCP",
    "News": "Noticias",
    "Pre-seed": "Pre-semilla",
    "Projects": "Proyectos",
    "Contact": "Contacto",
    "Systems Architect · Lima, Peru": "Arquitecto de Sistemas · Lima, Perú",
    "Smart Solutions · Lima, Peru": "Soluciones Inteligentes · Lima, Perú",
    "Interdisciplinary Systems Architect — AI, Robotics, XR, Industrial Systems": "Arquitecto de Sistemas Interdisciplinario — IA, Robótica, XR, Sistemas Industriales",
    "Know How": "Know How",
    "I design and connect intelligent systems across AI, robotics, spatial computing and industrial technology to build robust real-world solutions.": "Diseño y conecto sistemas inteligentes en IA, robótica, computación espacial y tecnología industrial para construir soluciones robustas del mundo real.",
    "I design and connect intelligent systems across AI, robotics, and industrial technology to build robust real-world solutions alongside strategic allies committed to automation and the large-scale expansion of intelligent solutions.": "Diseño y conecto sistemas inteligentes en IA, robótica y tecnología industrial para construir soluciones robustas del mundo real, junto a aliados estratégicos que apuestan por la automatización y la expansión de soluciones inteligentes a gran escala.",
    "Chief Executive Officer": "Chief Executive Officer",
    "Chief Business Officer": "Chief Business Officer",
    "Chief Operating Officer": "Chief Operating Officer",
    "Business Development Associate": "Business Development Associate",
    "CEO — Human & Machines": "CEO — Human & Machines",
    "BDA — Magnus G.C. Consulting": "BDA — Magnus G.C. Consulting",
    "Let's talk": "Hablemos",
    "Explore architecture ↓": "Explorar arquitectura ↓",
    "Scroll": "Deslizar",
    "Systems Thinking": "Pensamiento sistémico",
    "I build the": "Construyo el",
    "connective tissue": "tejido conectivo",
    "between intelligence and deployment.": "entre la inteligencia y el despliegue.",
    "AI models, hardware systems, human interfaces, and industrial constraints rarely speak the same language. I translate between them — designing coherent architectures that work end-to-end, from model selection to physical deployment.": "Los modelos de IA, sistemas de hardware, interfaces humanas y restricciones industriales rara vez hablan el mismo lenguaje. Yo traduzco entre ellos, diseñando arquitecturas coherentes que funcionan de extremo a extremo, desde la selección del modelo hasta el despliegue físico.",
    "Interactive System Architecture · Drag to rotate · Hover nodes": "Arquitectura de sistema interactiva · Arrastra para rotar · Pasa sobre nodos",
    "Live": "En vivo",
    "AI Integration Layer": "Capa de Integración de IA",
    "Selecting, fine-tuning, and deploying AI models within real operational constraints — latency, compute, edge vs cloud, and reliability requirements.": "Selección, ajuste fino y despliegue de modelos de IA bajo restricciones operativas reales: latencia, cómputo, edge vs cloud y requisitos de confiabilidad.",
    "Hardware–Software Bridge": "Puente Hardware–Software",
    "Connecting robotics, IoT devices, sensors, and industrial systems with intelligent software layers — from NAO robots to LoRaWAN networks.": "Conectando robótica, dispositivos IoT, sensores y sistemas industriales con capas de software inteligente. Diseño de sistemas centralizados y personalizados.",
    "Spatial & XR Systems": "Sistemas Espaciales y XR",
    "Designing immersive interfaces grounded in real data — depth models, computer vision pipelines, and XR experiences that serve operational purposes.": "Diseñando interfaces inmersivas basadas en datos reales: modelos de profundidad, pipelines de visión por computadora y experiencias XR con propósito operativo.",
    "End-to-End Coherence": "Coherencia End-to-End",
    "Ensuring every layer — data, inference, interface, deployment — forms a unified, maintainable system rather than a patchwork of disconnected tools.": "Asegurando que cada capa (datos, inferencia, interfaz y despliegue) forme un sistema unificado y mantenible, no un conjunto de herramientas desconectadas.",
    "Applied Systems": "Sistemas Aplicados",
    "Embodied AI Ecosystem": "Ecosistema Embodied AI",
    "Understanding New Types of Intelligence": "Comprender nuevos tipos de inteligencia",
    "Skills": "Skills",
    "Independent Work First": "Trabajo Propio Primero",
    "Own Builds + NONHUMAN": "Desarrollos Propios + NONHUMAN",
    "These are independent developments I build personally:": "Estos son desarrollos independientes que construyo personalmente:",
    "A builder of applied systems for businesses that need intelligence embedded in their operations — not as a feature, but as infrastructure.": "Constructor de sistemas aplicados para empresas que necesitan inteligencia integrada en sus operaciones, no como una función sino como infraestructura.",
    "NONHUMAN has two clear areas:": "NONHUMAN tiene dos áreas claras:",
    "NONHUMAN is a technology research group focused on the development, study, and application of Artificial Intelligence and robotics.": "NONHUMAN es un grupo de investigación tecnológica enfocado en el desarrollo, estudio y aplicación de Inteligencia Artificial y robótica.",
    "NONHUMAN is an embodied AI and robotics research group based in Lima, Peru, building a bridge from frontier research to real deployments.": "NONHUMAN es un grupo de investigación en embodied AI y robótica, con base en Lima, Perú, que construye un puente entre investigación de frontera y despliegues reales.",
    "Research Lab (Core)": "Laboratorio de Investigación (Core)",
    "Study and development of machine learning, LLMs, physical AI and autonomous control for humanoid and bimanual systems focused on LATAM realities.": "Estudio y desarrollo de machine learning, LLMs, physical AI y control autónomo para sistemas humanoides y bimanuales enfocados en realidades de LATAM.",
    "Open Technical Ecosystem": "Ecosistema Técnico Abierto",
    "Active publication and experimentation culture on GitHub and Hugging Face to make advanced AI and robotics research more accessible to builders.": "Cultura activa de publicación y experimentación en GitHub y Hugging Face para hacer más accesible la investigación avanzada de IA y robótica para builders.",
    "Physical AI + Industrial Integration": "Physical AI + Integración Industrial",
    "Software and hardware integration through robotic arms, 3D perception, edge AI and industrial stacks, including Siemens-oriented architectures (Jetson edge, OPC UA/PROFINET workflows).": "Integración de software y hardware mediante brazos robóticos, percepción 3D, edge AI y stacks industriales, incluyendo arquitecturas orientadas a Siemens (edge con Jetson, flujos OPC UA/PROFINET).",
    "Flagship R&D Directions": "Líneas Clave de I+D",
    "Low-cost robotics training systems (SO-ARM100), LLM architecture exploration (MIND), diffusion modeling work (DDPM), and data-centric learning methods such as reinforcement and imitation learning.": "Sistemas de entrenamiento robótico de bajo costo (SO-ARM100), exploración de arquitecturas LLM (MIND), trabajo en modelos de difusión (DDPM) y métodos de aprendizaje centrados en datos como reinforcement learning e imitation learning.",
    "Human & Machines (Commercial Arm)": "Human & Machines (Brazo Comercial)",
    "Robots as a Service (RaaS) for retail, events, museums and hospitality: deploy robots to capture attention, generate interaction, and convert visits into memorable brand experiences.": "Robots as a Service (RaaS) para retail, eventos, museos y hostelería: despliegue de robots para captar atención, generar interacción y convertir visitas en experiencias de marca memorables.",
    "RaaS Capabilities and Model": "Capacidades y Modelo RaaS",
    "Remote Presence (teleoperation), Learned Tasks (beta), Coordinated Movement (beta), flexible event/monthly managed services, safety-first deployments, and current early-partner waitlist execution.": "Presencia Remota (teleoperación), Tareas Aprendidas (beta), Movimiento Coordinado (beta), servicios gestionados flexibles por evento/suscripción mensual, despliegues con enfoque de seguridad y ejecución actual en modalidad early-partner (waitlist).",
    "Core Mission": "Misión Central",
    "Understanding new types of intelligence: exploring how artificial and non-human systems interact, learn, and perceive the world beyond traditional AI.": "Comprender nuevos tipos de inteligencia: explorar cómo los sistemas artificiales y no-humanos interactúan, aprenden y perciben el mundo más allá de la IA tradicional.",
    "Accessible Open Research": "Investigación Abierta y Accesible",
    "Active open work on GitHub and Hugging Face, sharing repositories, key architecture insights, and experimentation for the technical community.": "Trabajo abierto y activo en GitHub y Hugging Face, compartiendo repositorios, hallazgos sobre arquitecturas clave y experimentación para la comunidad técnica.",
    "Software + Hardware Integration": "Integración de Software + Hardware",
    "Beyond language models, NONHUMAN connects intelligence with the physical world through robotic arms, computer vision, and autonomous control systems.": "Más allá de los modelos de lenguaje, NONHUMAN conecta la inteligencia con el mundo físico mediante brazos robóticos, visión por computadora y sistemas de control autónomo.",
    "Key Projects": "Proyectos Clave",
    "SO-ARM100 for low-cost robotics training (reinforcement learning, imitation learning, VLMs), MIND for LLM components and architectures, and diffusion model research (DDPM).": "SO-ARM100 para entrenamiento robótico de bajo costo (aprendizaje por refuerzo, aprendizaje por imitación, VLMs), MIND para componentes y arquitecturas de LLMs, e investigación en modelos de difusión (DDPM).",
    "Active Technical Community in Peru": "Comunidad Técnica Activa en Perú",
    "With contact headquarters in Lima, Peru (Blvd. Plaza Mantaro, San Miguel), NONHUMAN promotes frontier AI research in the region and engages highly technical talent.": "Con sede de contacto en Lima, Perú (Blvd. Plaza Mantaro, San Miguel), NONHUMAN impulsa investigación de frontera en IA en la región e interactúa con talento técnico de alto nivel.",
    "Intelligent CRM / ERP Systems": "Sistemas CRM / ERP Inteligentes",
    "Custom operational platforms with embedded AI for decision support, automation, and insight generation.": "Plataformas operativas personalizadas con IA embebida para soporte de decisiones, automatización y generación de insights.",
    "AI Chat Experiences": "Experiencias de Chat con IA",
    "Context-aware conversational agents tuned for specific domains, workflows, and organizational knowledge.": "Agentes conversacionales con contexto, ajustados a dominios, flujos de trabajo y conocimiento organizacional específicos.",
    "Process Automation": "Automatización de Procesos",
    "End-to-end workflow automation connecting disparate systems through intelligent orchestration layers.": "Automatización de flujos end-to-end conectando sistemas dispares mediante capas de orquestación inteligente.",
    "Asset Tracking — LoRaWAN, BLE, GPS": "Trazabilidad de Activos — LoRaWAN, BLE, GPS",
    "Real-time tracking systems for industrial and logistics environments using low-power wireless protocols.": "Sistemas de trazabilidad en tiempo real para entornos industriales y logísticos usando protocolos inalámbricos de bajo consumo.",
    "Research Division": "División de Investigación",
    "An AI community focused on understanding new types of intelligence.": "Una comunidad de IA enfocada en entender nuevos tipos de inteligencia.",
    "Human & Machines (Commercial Division)": "Human & Machines (División Comercial)",
    "A Robotics as a Service (RaaS) model that deploys robots for businesses in retail, events, and hospitality to attract attention, improve interaction, and create memorable experiences.": "Un modelo de Robótica como Servicio (RaaS) que despliega robots para negocios en retail, eventos y hostelería para atraer público, mejorar la interacción y crear experiencias memorables.",
    "RaaS Capabilities": "Capacidades RaaS",
    "Remote presence, learning by demonstration, and choreographed movement programs adapted to business scenarios.": "Presencia remota, aprendizaje por demostración y programas de movimientos coreografiados adaptados a escenarios de negocio.",
    "Applied Intelligence Systems": "Sistemas de Inteligencia Aplicada",
    "Research + Robotics as a Service": "Investigación + Robótica como Servicio",
    "Technology Research Group": "Grupo de Investigación Tecnológica",
    "Embodied AI Research + RaaS Execution": "Investigación Embodied AI + Ejecución RaaS",
    "Role": "Rol",
    "Human & Machines Role": "Rol en Human & Machines",
    "CEO": "CEO",
    "Research": "Investigación",
    "New Intelligence": "Nueva Inteligencia",
    "Commercial": "Comercial",
    "Human & Machines · RaaS": "Human & Machines · RaaS",
    "Open Platforms": "Plataformas Abiertas",
    "Research + Physical AI Products": "Investigación + Productos de Physical AI",
    "Commercial Initiative": "Iniciativa Comercial",
    "Trusted By": "Con la confianza de",
    "PUCP · DINAUT · Ciclos Café · Siemens": "PUCP · DINAUT · Ciclos Café · Siemens",
    "AI + Robotics R&D": "I+D en IA + Robótica",
    "Location": "Ubicación",
    "Lima, Peru": "Lima, Perú",
    "Focus": "Enfoque",
    "Operational Impact": "Impacto Operacional",
    "Strategic Ecosystem": "Ecosistema Estratégico",
    "Aerospace Engineering Group": "Grupo de Ingeniería Aeroespacial",
    "GIA PUCP is the Aerospace Engineering Group at PUCP, focused on training engineers and scientists through experimental rocketry and space science research, executing real projects that integrate applied technical formation, academic knowledge production, and technology validation for the Peruvian aerospace ecosystem.": "GIA PUCP es el Grupo de Ingeniería Aeroespacial de la PUCP, enfocado en formar ingenieros y científicos mediante investigación en cohetería experimental y ciencias espaciales, ejecutando proyectos reales que integran formación técnica aplicada, producción de conocimiento académico y validación tecnológica para el ecosistema aeroespacial peruano.",
    "COO — GIA PUCP": "COO — GIA PUCP",
    "GIA · Mission": "GIA · Misión",
    "Experimental Rocketry & Space Science": "Cohetería Experimental y Ciencias Espaciales",
    "Mission-driven formation, research, and execution through real aerospace projects that connect university learning with validation in the field.": "Formación, investigación y ejecución orientadas por una misión, a través de proyectos aeroespaciales reales que conectan el aprendizaje universitario con la validación en campo.",
    "PUCP · Aerospace": "PUCP · Aeroespacial",
    "GIA · Milestones": "GIA · Hitos",
    "Flight-Validated Milestones": "Hitos con Validación en Vuelo",
    "At the Latin America Space Challenge, MiSat reached 6th place in satellites and Kuntur 1 reached 7th place in the 500-meter rocketry category.": "En el Latin America Space Challenge, MiSat obtuvo el 6.º lugar en satélites y Kuntur 1 logró el 7.º lugar en la categoría de cohetería de 500 metros.",
    "MiSat · Kuntur 1": "MiSat · Kuntur 1",
    "Recent": "Recientes",
    "updates": "actualizaciones",
    "Recent Update · GIA PUCP": "Actualización reciente · GIA PUCP",
    "Rocket launch campaign in Chincha": "Campaña de lanzamiento de cohete en Chincha",
    "GIA PUCP recently completed a rocket launch in Chincha, adding a new flight-validation milestone to its experimental rocketry roadmap in Peru.": "GIA PUCP completó recientemente un lanzamiento de cohete en Chincha, sumando un nuevo hito de validación en vuelo a su hoja de ruta de cohetería experimental en el Perú.",
    "This update aligns with GIA's mission of training engineers and scientists through real aerospace projects, experimental rocketry, and technology validation from the university.": "Esta actualización se alinea con la misión de GIA de formar ingenieros y científicos mediante proyectos aeroespaciales reales, cohetería experimental y validación tecnológica desde la universidad.",
    "Launch post": "Publicación del lanzamiento",
    "GIA website": "Web de GIA",
    "Why it matters": "Por qué importa",
    "Validates operations, logistics, and real-world execution beyond lab tests.": "Valida operaciones, logística y ejecución en condiciones reales más allá de las pruebas de laboratorio.",
    "Strengthens the team's mission of applied aerospace training and technology validation.": "Refuerza la misión del equipo en formación aeroespacial aplicada y validación tecnológica.",
    "Connects university research with field deployment and systems discipline.": "Conecta la investigación universitaria con el despliegue en campo y la disciplina de sistemas.",
    "A strategic technology consulting ecosystem focused on productivity, consulting, executive training, and AI solutions for companies in Peru. As a Business Development Associate, I support ecosystem growth, partnerships, and commercial expansion.": "Un ecosistema estratégico de consultoría tecnológica enfocado en productividad, consultoría, capacitación ejecutiva y soluciones de IA para empresas en Perú. Como Business Development Associate, apoyo el crecimiento del ecosistema, las alianzas y la expansión comercial.",
    "Smart Solutions": "Soluciones Inteligentes",
    "Systems Thinking": "Pensamiento sistémico",
    "Technical Skills": "Skills Técnicos",
    "Selected skills": "Habilidades seleccionadas",
    "Magnus · Venture": "Magnus · Venture",
    "An AI forecasting platform built for decision systems. Forecast surfaces predictive intelligence across operational, financial, and strategic domains — turning data signals into actionable foresight.": "Una plataforma de pronóstico con IA diseñada para sistemas de decisión. Forecast aporta inteligencia predictiva en dominios operativos, financieros y estratégicos, convirtiendo señales de datos en anticipación accionable.",
    "Circular Economy · B2B": "Economía Circular · B2B",
    "A B2B waste exchange platform enabling circular economy at scale. Trueke connects industrial waste generators with processors and recyclers, creating closed-loop material flows.": "Una plataforma B2B de intercambio de residuos que habilita la economía circular a escala. Trueke conecta generadores de residuos industriales con procesadores y recicladores, creando flujos cerrados de materiales.",
    "Early Stage": "Etapa Temprana",
    "Pre-seed": "Pre-semilla",
    "architecture": "arquitectura",
    "System Design": "Diseño de Sistemas",
    "Define the architecture before writing a line of code. Which components? Which constraints? What can be deferred?": "Define la arquitectura antes de escribir una línea de código. ¿Qué componentes? ¿Qué restricciones? ¿Qué puede diferirse?",
    "Stack Selection": "Selección de Stack",
    "Choose technology that fits the team, the timeline, and the growth trajectory — not just what's fashionable.": "Elige tecnología que encaje con el equipo, el cronograma y la trayectoria de crecimiento, no solo lo que está de moda.",
    "MVP Execution": "Ejecución de MVP",
    "Ship something real, fast. An MVP that validates assumptions without creating technical debt that kills the next phase.": "Lanza algo real, rápido. Un MVP que valide supuestos sin crear deuda técnica que mate la siguiente fase.",
    "Scale Readiness": "Preparación para Escalar",
    "Build with growth in mind from day one — so that when traction comes, the architecture doesn't become the ceiling.": "Construye pensando en crecimiento desde el día uno, para que cuando llegue la tracción la arquitectura no sea el techo.",
    "I help early-stage startups design system architecture and ship": "Ayudo a startups en etapa temprana a diseñar arquitectura de sistemas y lanzar",
    "robust MVPs": "MVPs robustos",
    "— without sacrificing the foundation they'll need to scale.": "— sin sacrificar la base que necesitarán para escalar.",
    "If you're at the pre-seed stage and need someone who can think at the systems level while also being hands-on with the build — let's talk.": "Si estás en etapa pre-semilla y necesitas a alguien que piense a nivel de sistemas y además construya de forma hands-on, hablemos.",
    "Technical Work": "Trabajo Técnico",
    "Technical Skills": "Skills Técnicos",
    "Selected": "Habilidades",
    "projects": "seleccionados",
    "skills": "seleccionadas",
    "Depth Estimation": "Estimación de Profundidad",
    "Industrial Computer Vision Systems": "Sistemas de Visión por Computadora Industrial",
    "Let's build": "Construyamos",
    "Ready to connect": "¿Listo para conectar",
    "deep systems?": "sistemas profundos?",
    "I'm open to collaboration on deep-tech systems, applied AI, and industrial intelligence — whether you're a startup, a research team, or a company trying to make sense of complex technology.": "Estoy abierto a colaborar en sistemas deep-tech, IA aplicada e inteligencia industrial, ya seas una startup, un equipo de investigación o una empresa que busca entender tecnología compleja.",
    "Let's talk architecture.": "Hablemos de arquitectura.",
    "Send a message": "Enviar mensaje"
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
      document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
      document.documentElement.lang = lang === 'es' ? 'es' : 'en';
      window.__dbpaLang = lang;
      window.dispatchEvent(new CustomEvent('dbpa:langchange', { detail: { lang: lang } }));
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

  var cloud1 = makeCloud(7000, 24, 2,   0xFF6B2B, 0.050, 0.70);
  var cloud2 = makeCloud(4000, 18, 1.5, 0x38d9b4, 0.040, 0.60);
  var cloud3 = makeCloud(2500, 12, 1.0, 0xFF9A70, 0.035, 0.50);
  var cloud4 = makeCloud(1500,  8, 0.5, 0xffffff, 0.025, 0.40);
  scene.add(cloud1, cloud2, cloud3, cloud4);

  var octGeo = new THREE.OctahedronGeometry(3.2, 2);
  var octMat = new THREE.MeshStandardMaterial({
    color: 0x0d1020, emissive: 0xFF6B2B, emissiveIntensity: 0.06,
    roughness: 0.2, metalness: 0.95, transparent: true, opacity: 0.55
  });
  var oct = new THREE.Mesh(octGeo, octMat);
  scene.add(oct);

  var octWire = new THREE.Mesh(octGeo,
    new THREE.MeshBasicMaterial({ color: 0xFF6B2B, wireframe: true, transparent: true, opacity: 0.12 })
  );
  octWire.scale.setScalar(1.012);
  scene.add(octWire);

  function makeRing(inner, outer, col, rx, ry) {
    var m = new THREE.Mesh(
      new THREE.RingGeometry(inner, outer, 128),
      new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.14, depthWrite: false })
    );
    m.rotation.x = rx; m.rotation.y = ry; return m;
  }
  var rA = makeRing(5,   5.12, 0xFF6B2B, Math.PI/2.2, 0.3);
  var rB = makeRing(6.8, 6.90, 0x38d9b4, Math.PI/1.7, -0.2);
  var rC = makeRing(8.5, 8.60, 0xFF9A70, Math.PI/3.0, 0.5);
  scene.add(rA, rB, rC);

  function makeNode(r, hex) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(r, 8, 8),
      new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 1 })
    );
  }
  var orbiters = [
    { m: makeNode(0.10, 0xFF6B2B), angle: 0,           speed: 0.007, orb: 5.06, tilt: Math.PI/2.2 },
    { m: makeNode(0.09, 0x38d9b4), angle: Math.PI*0.7, speed: 0.005, orb: 6.85, tilt: Math.PI/1.7 },
    { m: makeNode(0.08, 0xFF9A70), angle: Math.PI*1.4, speed: 0.003, orb: 8.55, tilt: Math.PI/3.0 }
  ];
  orbiters.forEach(function(o) { scene.add(o.m); });

  scene.add(new THREE.AmbientLight(0x0a0c10, 4));
  var lavLight = new THREE.PointLight(0xFF6B2B, 2, 50);
  scene.add(lavLight);
  var tealLight = new THREE.PointLight(0x38d9b4, 1.2, 35);
  tealLight.position.set(12, 6, 4);
  scene.add(tealLight);

  var heroDragging = false, heroPrev = { x:0, y:0 }, heroVX = 0, heroVY = 0;
  canvas.addEventListener('mousedown', function(e) { heroDragging = true; heroPrev = { x:e.clientX, y:e.clientY }; });
  window.addEventListener('mouseup', function() { heroDragging = false; });
  window.addEventListener('mousemove', function(e) {
    if (!heroDragging) return;
    heroVX += (e.clientY - heroPrev.y) * 0.004;
    heroVY += (e.clientX - heroPrev.x) * 0.004;
    heroPrev = { x:e.clientX, y:e.clientY };
  });

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var heroT = 0;
  function heroAnimate() {
    requestAnimationFrame(heroAnimate);
    heroT += 0.007;
    camX += (tgX - camX) * 0.03;
    camY += (tgY - camY) * 0.03;
    camera.position.x = camX * 2.5;
    camera.position.y = -camY * 1.8;
    var sf = window.scrollY / ((document.body.scrollHeight - window.innerHeight) || 1);
    camera.position.z = 30 - sf * 14;
    camera.lookAt(0, 0, 0);
    cloud1.rotation.y = heroT * 0.05;
    cloud2.rotation.y = -heroT * 0.035; cloud2.rotation.x = heroT * 0.015;
    cloud3.rotation.z = heroT * 0.025;
    cloud4.rotation.y = heroT * 0.07;
    heroVX *= 0.92; heroVY *= 0.92;
    oct.rotation.x += 0.002 + heroVX;
    oct.rotation.y += 0.004 + heroVY;
    octWire.rotation.copy(oct.rotation);
    var pulse = 1 + Math.sin(heroT * 1.1) * 0.018;
    oct.scale.setScalar(pulse);
    octWire.scale.setScalar(pulse * 1.012);
    octMat.emissiveIntensity = 0.06 + Math.sin(heroT * 1.4) * 0.03;
    rA.rotation.z = heroT * 0.10;
    rB.rotation.z = -heroT * 0.07;
    rC.rotation.z = heroT * 0.04;
    orbiters.forEach(function(o) {
      o.angle += o.speed;
      o.m.position.x = Math.cos(o.angle) * o.orb;
      o.m.position.y = Math.sin(o.angle) * o.orb * Math.sin(o.tilt);
      o.m.position.z = Math.sin(o.angle) * o.orb * Math.cos(o.tilt) * 0.28;
    });
    lavLight.intensity = 2 + Math.sin(heroT * 0.8) * 0.7;
    renderer.render(scene, camera);
  }
  heroAnimate();
})();

(function() {
  var THREE = window.THREE;
  if (!THREE) return;
  var wrap = document.getElementById('arch-graph-wrap');
  var c = document.getElementById('arch-canvas');
  if (!wrap || !c) return;

  var gr = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
  gr.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  gr.setClearColor(0x080a0e, 0);

  var gScene = new THREE.Scene();
  gScene.fog = new THREE.FogExp2(0x090b12, 0.026);
  var gCam = new THREE.PerspectiveCamera(48, wrap.clientWidth / wrap.clientHeight, 0.1, 500);
  gCam.position.set(0, 0, 22);

  function resize() {
    var w = wrap.clientWidth, h = wrap.clientHeight;
    gr.setSize(w, h);
    gCam.aspect = w / h;
    gCam.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function makeGraphDust(count, radius) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    var cols = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var rr = Math.pow(Math.random(), 0.78) * radius;
      var ang = Math.random() * Math.PI * 2;
      var lift = (Math.random() - 0.5) * radius * 0.92;
      pos[i * 3] = Math.cos(ang) * rr;
      pos[i * 3 + 1] = lift;
      pos[i * 3 + 2] = Math.sin(ang) * rr * 0.75;
      var pick = i % 3 === 0 ? new THREE.Color(0xFF6B2B) : (i % 3 === 1 ? new THREE.Color(0x38d9b4) : new THREE.Color(0xFF9A70));
      var bright = 0.32 + Math.random() * 0.68;
      cols[i * 3] = pick.r * bright;
      cols[i * 3 + 1] = pick.g * bright;
      cols[i * 3 + 2] = pick.b * bright;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.42,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
  }

  function getGraphLanguage() {
    return window.__dbpaLang === 'es' ? 'es' : 'en';
  }

  var ND = [
    { labelEn:'About Me',      labelEs:'Sobre Mi',        subEn:'DANCE-TRAVEL-CREATE-FOOTBALL',      subEs:'BAILE-VIAJES-CREAR-FUTBOL',       col:0xFF4F5E, x: 0,   y:-0.55, z: 0.2,  sz:0.82, ring:true  },
    { labelEn:'Robotics',      labelEs:'Robotics',        subEn:'NAO-UNITREE-COBOTS',                subEs:'NAO-UNITREE-COBOTS',              col:0x38d9b4, x:-6.1, y: 2.35, z: 1.0,  sz:0.50 },
    { labelEn:'XR Experience', labelEs:'Experiencia XR',  subEn:'QUEST-PICO-MAGICLEAP-HOLOLENS',     subEs:'QUEST-PICO-MAGICLEAP-HOLOLENS',   col:0xFF9A70, x: 5.9, y: 2.85, z:-0.9,  sz:0.50 },
    { labelEn:'IoT Network',   labelEs:'Red IoT',         subEn:'BLE-LORAWAN-UWB',                   subEs:'BLE-LORAWAN-UWB',                 col:0x38d9b4, x:-5.9, y:-3.15, z: 0.45, sz:0.45 },
    { labelEn:'Industrial',    labelEs:'Industrial',      subEn:'SIEMENS-ROCKWELL-ABB',              subEs:'SIEMENS-ROCKWELL-ABB',            col:0xFF6B2B, x: 5.2, y:-3.2,  z:-0.45, sz:0.44 },
    { labelEn:'Web Design',    labelEs:'Diseno Web',      subEn:'UI-UX-FRONTEND',                    subEs:'UI-UX-FRONTEND',                  col:0xffffff, x: 0.15,y:-5.4,  z: 0.95, sz:0.38 },
    { labelEn:'Interfaces',    labelEs:'Interfaces',      subEn:'CRM-ERP-DASHBOARDS',                subEs:'CRM-ERP-DASHBOARDS',              col:0xffffff, x: 0.55,y: 5.35, z:-0.8,  sz:0.38 },
    { labelEn:'AI Models',     labelEs:'Modelos IA',      subEn:'LLM-VLM-ML-DL',                     subEs:'LLM-VLM-ML-DL',                   col:0xffffff, x:-0.35,y: 3.25, z: 2.6,  sz:0.40 },
    { labelEn:'Deployment',    labelEs:'Deployment',      subEn:'CLOUD-ON-PREM-HYBRID',              subEs:'CLOUD-ON-PREM-HYBRID',            col:0x38d9b4, x: 3.35,y: 1.05, z: 2.7,  sz:0.36 }
  ];
  ND.forEach(function(nd) {
    var lang = getGraphLanguage();
    nd.label = lang === 'es' ? nd.labelEs : nd.labelEn;
    nd.sub = lang === 'es' ? nd.subEs : nd.subEn;
  });
  var EDGES = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[1,3],[1,7],[2,8],[2,6],[3,5],[4,5],[6,8],[7,3],[7,5],[8,2]];

  var pivot = new THREE.Group();
  var nodeMeshes = [];
  var basePos = [];
  var graphDust = makeGraphDust(1800, 13.5);
  gScene.add(graphDust);

  ND.forEach(function(nd) {
    var mat = new THREE.MeshStandardMaterial({
      color: nd.col, emissive: nd.col, emissiveIntensity: nd.ring ? 1.05 : 0.72,
      roughness: 0.18, metalness: 0.86, transparent: true, opacity: 0.98
    });
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(nd.sz, 24, 24), mat);
    mesh.position.set(nd.x, nd.y, nd.z);
    mesh.userData.nd = nd;
    var glowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(nd.sz * 1.85, 18, 18),
      new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: nd.ring ? 0.22 : 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.userData.glow = glowMesh;
    mesh.add(glowMesh);
    var auraMesh = new THREE.Mesh(
      new THREE.SphereGeometry(nd.sz * 2.65, 18, 18),
      new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: nd.ring ? 0.08 : 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide })
    );
    mesh.userData.aura = auraMesh;
    mesh.add(auraMesh);
    if (nd.ring) {
      var rMesh = new THREE.Mesh(
        new THREE.RingGeometry(nd.sz + 0.15, nd.sz + 0.28, 64),
        new THREE.MeshBasicMaterial({ color: nd.col, side: THREE.DoubleSide, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rMesh.rotation.x = Math.PI / 2;
      mesh.userData.ringMesh = rMesh;
      mesh.add(rMesh);
    }
    var orbitMesh = new THREE.Mesh(
      new THREE.TorusGeometry(nd.sz * 1.56, Math.max(nd.sz * 0.042, 0.018), 12, 64),
      new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: nd.ring ? 0.3 : 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    orbitMesh.rotation.x = Math.PI / 2.35;
    orbitMesh.rotation.y = Math.PI / 4;
    mesh.userData.orbitMesh = orbitMesh;
    mesh.add(orbitMesh);
    var wMesh = new THREE.Mesh(
      new THREE.SphereGeometry(nd.sz * 1.35, 8, 8),
      new THREE.MeshBasicMaterial({ color: nd.col, wireframe: true, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.userData.wire = wMesh;
    mesh.add(wMesh);
    pivot.add(mesh);
    nodeMeshes.push(mesh);
    basePos.push(new THREE.Vector3(nd.x, nd.y, nd.z));
  });

  var edgeLines = [];
  function buildEdges() {
    edgeLines.forEach(function(l) { pivot.remove(l); });
    edgeLines.length = 0;
    EDGES.forEach(function(pair, ei) {
      var a = pair[0], b = pair[1];
      var pa = nodeMeshes[a].position.clone();
      var pb = nodeMeshes[b].position.clone();
      var mid = pa.clone().lerp(pb, 0.5);
      mid.z += (ei % 3 - 1) * 0.5;
      var curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
      var pts = curve.getPoints(32);
      var geo = new THREE.BufferGeometry().setFromPoints(pts);
      var colA = new THREE.Color(ND[a].col);
      var colB = new THREE.Color(ND[b].col);
      var cols = [];
      for (var i = 0; i <= 32; i++) {
        var cc = colA.clone().lerp(colB, i / 32);
        cols.push(cc.r, cc.g, cc.b);
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
      var mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
      var line = new THREE.Line(geo, mat);
      line.userData.a = a; line.userData.b = b; line.userData.mat = mat; line.userData.baseOpacity = (a === 0 || b === 0) ? 0.34 : 0.22;
      pivot.add(line);
      edgeLines.push(line);
    });
  }
  buildEdges();

  var pulseObjs = EDGES.map(function(pair) {
    var mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.10, 8, 8),
      new THREE.MeshStandardMaterial({ color: ND[pair[0]].col, emissive: ND[pair[0]].col, emissiveIntensity: 2.8, transparent: true, opacity: 0.95 })
    );
    mesh.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshBasicMaterial({ color: ND[pair[0]].col, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })
    ));
    pivot.add(mesh);
    return { a: pair[0], b: pair[1], t: Math.random(), speed: 0.004 + Math.random() * 0.004, mesh: mesh };
  });
  gScene.add(pivot);

  gScene.add(new THREE.AmbientLight(0x0f1422, 4.1));
  gScene.add(new THREE.HemisphereLight(0xFF9A70, 0x08101a, 1.25));
  var gLav = new THREE.PointLight(0xFF6B2B, 4.2, 44);
  gLav.position.set(0, 0, 8);
  gScene.add(gLav);
  var gTeal = new THREE.PointLight(0x38d9b4, 3.4, 34);
  gTeal.position.set(-8, 4, 5);
  gScene.add(gTeal);
  var gWhite = new THREE.PointLight(0xffffff, 1.3, 26);
  gWhite.position.set(7, -3, 7);
  gScene.add(gWhite);

  var labelsDiv = document.createElement('div');
  labelsDiv.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
  wrap.appendChild(labelsDiv);
  function colorCss(hex, alpha) {
    var c3 = new THREE.Color(hex);
    return 'rgba(' + Math.round(c3.r * 255) + ',' + Math.round(c3.g * 255) + ',' + Math.round(c3.b * 255) + ',' + alpha + ')';
  }
  function renderNodeLabel(nd) {
    return (
      '<div style=\"font-family:Syne,sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.05em;color:rgba(242,240,237,0.94);text-shadow:0 0 18px ' + colorCss(nd.col, 0.72) + ';\">' + nd.label + '</div>' +
      '<div style=\"font-size:.46rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(242,240,237,0.34);margin-top:2px;text-shadow:0 0 12px ' + colorCss(nd.col, 0.18) + ';\">' + nd.sub + '</div>'
    );
  }

  var labelEls = ND.map(function(nd) {
    var div = document.createElement('div');
    div.style.cssText = 'position:absolute;transform:translate(-50%,-130%);text-align:center;pointer-events:none;transition:opacity .25s;';
    div.innerHTML = renderNodeLabel(nd);
    labelsDiv.appendChild(div);
    return div;
  });

  var tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:absolute;pointer-events:none;background:rgba(8,10,14,0.95);border:1px solid rgba(255,107,43,0.3);backdrop-filter:blur(12px);padding:.4rem .85rem;opacity:0;transition:opacity .2s;font-family:Syne,sans-serif;font-size:.68rem;font-weight:700;color:#FF6B2B;white-space:nowrap;z-index:20;';
  wrap.appendChild(tooltip);

  function syncGraphLanguage(lang) {
    ND.forEach(function(nd, i) {
      nd.label = lang === 'es' ? nd.labelEs : nd.labelEn;
      nd.sub = lang === 'es' ? nd.subEs : nd.subEn;
      if (labelEls[i]) labelEls[i].innerHTML = renderNodeLabel(nd);
    });
    if (hovIdx !== -1 && ND[hovIdx]) {
      tooltip.innerHTML = '<span style=\"color:#38d9b4\">' + ND[hovIdx].label + '</span>&nbsp;&middot;&nbsp;<span style=\"color:rgba(242,240,237,.55);font-weight:400\">' + ND[hovIdx].sub + '</span>';
    }
  }

  window.addEventListener('dbpa:langchange', function(e) {
    var nextLang = e && e.detail && e.detail.lang === 'es' ? 'es' : 'en';
    syncGraphLanguage(nextLang);
  });
  syncGraphLanguage(getGraphLanguage());

  var GRAPH_DRAG_SENSITIVITY = 0.0022;
  var GRAPH_DRAG_DAMPING = 0.84;
  var gDrag = false, gPrev = { x:0, y:0 }, gRX = 0, gRY = 0, gVX2 = 0, gVY2 = 0;
  wrap.addEventListener('mousedown', function(e) { gDrag = true; gPrev = { x:e.clientX, y:e.clientY }; });
  window.addEventListener('mouseup', function() { gDrag = false; });
  window.addEventListener('mousemove', function(e) {
    if (!gDrag) return;
    gVX2 += (e.clientY - gPrev.y) * GRAPH_DRAG_SENSITIVITY;
    gVY2 += (e.clientX - gPrev.x) * GRAPH_DRAG_SENSITIVITY;
    gPrev = { x:e.clientX, y:e.clientY };
  });

  var ray = new THREE.Raycaster();
  var mouse2 = new THREE.Vector2();
  var hovIdx = -1;
  wrap.addEventListener('mousemove', function(e) {
    var rect = wrap.getBoundingClientRect();
    mouse2.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse2.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(mouse2, gCam);
    var hits = ray.intersectObjects(nodeMeshes);
    if (hits.length > 0) {
      var nd = hits[0].object.userData.nd;
      var idx = ND.indexOf(nd);
      hovIdx = idx;
      tooltip.innerHTML = '<span style=\"color:#38d9b4\">' + nd.label + '</span>&nbsp;&middot;&nbsp;<span style=\"color:rgba(242,240,237,.55);font-weight:400\">' + nd.sub + '</span>';
      tooltip.style.opacity = '1';
      tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
      tooltip.style.top  = (e.clientY - rect.top  - 12) + 'px';
      edgeLines.forEach(function(l) { l.userData.mat.opacity = (l.userData.a === idx || l.userData.b === idx) ? 0.75 : 0.06; });
    } else {
      hovIdx = -1;
      tooltip.style.opacity = '0';
      edgeLines.forEach(function(l) { l.userData.mat.opacity = l.userData.baseOpacity; });
    }
  });
  wrap.addEventListener('mouseleave', function() {
    hovIdx = -1;
    tooltip.style.opacity = '0';
    edgeLines.forEach(function(l) { l.userData.mat.opacity = l.userData.baseOpacity; });
  });

  var gT = 0;
  var proj = new THREE.Vector3();
  function graphAnimate() {
    requestAnimationFrame(graphAnimate);
    gT += 0.008;
    gVX2 *= GRAPH_DRAG_DAMPING; gVY2 *= GRAPH_DRAG_DAMPING;
    gRX += gVX2; gRY += gVY2;
    pivot.rotation.x = gRX + Math.sin(gT * 0.18) * 0.06;
    pivot.rotation.y = gRY + gT * 0.04;
    graphDust.rotation.y = -gT * 0.035;
    graphDust.rotation.z = Math.sin(gT * 0.22) * 0.08;
    nodeMeshes.forEach(function(mesh, i) {
      var bp = basePos[i];
      mesh.position.set(
        bp.x + Math.sin(gT * 0.4 + i * 1.3) * 0.15,
        bp.y + Math.cos(gT * 0.35 + i * 0.9) * 0.12,
        bp.z + Math.sin(gT * 0.28 + i * 1.7) * 0.10
      );
      var tgt = (i === hovIdx) ? 1.9 : (i === 0 ? 1.1 + Math.sin(gT * 1.2) * 0.25 : 0.72 + Math.sin(gT * 0.8 + i) * 0.16);
      mesh.material.emissiveIntensity += (tgt - mesh.material.emissiveIntensity) * 0.1;
      var targetScale = i === hovIdx ? 1.22 : (i === 0 ? 1.05 + Math.sin(gT * 1.4) * 0.05 : 1);
      var nextScale = mesh.scale.x + (targetScale - mesh.scale.x) * 0.12;
      mesh.scale.setScalar(nextScale);
      if (mesh.userData.glow) {
        mesh.userData.glow.material.opacity = (i === hovIdx ? 0.34 : (i === 0 ? 0.26 : 0.18)) + Math.sin(gT * 1.7 + i) * 0.03;
      }
      if (mesh.userData.aura) {
        mesh.userData.aura.material.opacity = (i === hovIdx ? 0.13 : 0.06) + Math.sin(gT * 0.9 + i) * 0.015;
      }
      if (mesh.userData.wire) {
        mesh.userData.wire.rotation.y = gT * (0.3 + i * 0.05);
        mesh.userData.wire.rotation.x = gT * (0.2 + i * 0.03);
      }
      if (mesh.userData.orbitMesh) {
        mesh.userData.orbitMesh.rotation.z = gT * (0.55 + i * 0.05);
        mesh.userData.orbitMesh.rotation.y += 0.002 + i * 0.0002;
      }
      if (mesh.userData.ringMesh) {
        mesh.userData.ringMesh.rotation.z = -gT * 0.8;
      }
    });
    edgeLines.forEach(function(line, ei) {
      var a = line.userData.a, b = line.userData.b;
      var pa = nodeMeshes[a].position.clone();
      var pb = nodeMeshes[b].position.clone();
      var mid = pa.clone().lerp(pb, 0.5);
      mid.z += Math.sin(gT * 0.3 + ei) * 0.35;
      var pts = new THREE.QuadraticBezierCurve3(pa, mid, pb).getPoints(32);
      line.geometry.setFromPoints(pts);
      line.geometry.attributes.position.needsUpdate = true;
      if (hovIdx === -1) {
        line.userData.mat.opacity = line.userData.baseOpacity + Math.sin(gT * 1.6 + ei * 0.75) * 0.035;
      }
    });
    pulseObjs.forEach(function(p) {
      p.t += p.speed; if (p.t > 1) p.t = 0;
      var pa = nodeMeshes[p.a].position.clone();
      var pb = nodeMeshes[p.b].position.clone();
      var mid = pa.clone().lerp(pb, 0.5);
      p.mesh.position.copy(new THREE.QuadraticBezierCurve3(pa, mid, pb).getPoint(p.t));
      p.mesh.material.emissiveIntensity = 2.6 + Math.sin(gT * 3 + p.t * 10) * 0.8;
    });
    nodeMeshes.forEach(function(mesh, i) {
      proj.copy(mesh.position);
      pivot.localToWorld(proj);
      proj.project(gCam);
      var rect = wrap.getBoundingClientRect();
      labelEls[i].style.left = ((proj.x * 0.5 + 0.5) * rect.width) + 'px';
      labelEls[i].style.top = ((proj.y * -0.5 + 0.5) * rect.height - ND[i].sz * 60 - 14) + 'px';
      labelEls[i].style.opacity = (proj.z < 1) ? '1' : '0';
    });
    gLav.intensity = 4 + Math.sin(gT * 0.9) * 0.85;
    gTeal.intensity = 3.1 + Math.cos(gT * 1.1) * 0.45;
    gr.render(gScene, gCam);
  }
  graphAnimate();
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

export default function Page() {
  useEffect(() => {
    let cancelled = false;
    (window as any).__dbpaLandingInit = false;
    const init = () => {
      if (cancelled) return;
      const w = window as any;
      if (!w.THREE) return;
      // eslint-disable-next-line no-new-func
      new Function(LANDING_JS)();
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
      (window as any).__dbpaLandingInit = false;
    };
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      <div dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
      <PokemonOverlayBridge />
    </>
  );
}

