import Image from "next/image";

export default function LandingHero() {
  return (
    <section id="hero">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-tag">
            <span style={{ display: "inline-flex", alignItems: "center", gap: ".65rem" }}>
              <Image
                src="/diegopozo.webp"
                alt="Diego Pozo"
                width={36}
                height={36}
                priority
                style={{
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              />
              Smart Solutions · Lima, Peru
            </span>
          </p>
          <h1 className="hero-name">
            Diego Bruno
            <br />
            Pozo Abregu
          </h1>
          <p className="hero-subtitle">Know How</p>
          <p className="hero-desc">
            I design and connect intelligent systems across AI, robotics, and industrial technology to build robust
            real-world solutions alongside strategic allies committed to automation and the large-scale expansion of
            intelligent solutions.
          </p>
          <div className="hero-btns">
            <a href="#contact" className="btn-grad">
              Let&apos;s talk
            </a>
            <a href="#architecture" className="btn-ghost">
              Explore architecture ↓
            </a>
          </div>
        </div>

        <div className="hero-roles">
          <a className="hero-role-link" href="https://humans-machines.nonhuman.site/" target="_blank" rel="noreferrer">
            <span className="hero-role-code">CEO</span>
            <span className="hero-role-company">BEYONDHUMAN</span>
            <span className="hero-role-title">Chief Executive Officer</span>
          </a>
          <a className="hero-role-link" href="https://nonhuman.site/" target="_blank" rel="noreferrer">
            <span className="hero-role-code">CBO</span>
            <span className="hero-role-company">NONHUMAN</span>
            <span className="hero-role-title">Chief Business Officer</span>
          </a>
          <a className="hero-role-link" href="https://www.giaperu.space/" target="_blank" rel="noreferrer">
            <span className="hero-role-code">CBO</span>
            <span className="hero-role-company">GIA PUCP</span>
            <span className="hero-role-title">Chief Business Officer</span>
          </a>
          <a className="hero-role-link" href="https://www.magnusgc.consulting/" target="_blank" rel="noreferrer">
            <span className="hero-role-code">BDA</span>
            <span className="hero-role-company">MAGNUS G.C. CONSULTING</span>
            <span className="hero-role-title">Business Development Associate</span>
          </a>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

