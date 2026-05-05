import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(__dirname, "_extracted_landing_inner.txt"), "utf8");

let b = src;

b = b.replaceAll(
  "\n(function() {\n  var THREE = window.THREE;\n  if (!THREE) return;\n",
  "\n(function() {\n  "
);

b = b.replace(
  /window\.__dbpaLandingInit = true;\n/g,
  `window.__dbpaLandingInit = true;

/** @type {boolean} */\nvar __dbpaTabVisible =
  typeof document !== "undefined" && document.visibilityState === "visible";
/** @type {boolean} */\nvar __dbpaReducedMotionHero = false;
/** @type {boolean} */\nvar __dbpaReducedMotionGraph = false;
/** @type {MediaQueryList | null} */\nvar mqMediaGraph = null;

/** Schedule graph loop (assigned after scene init) @type {{ (): void } | null} */\nvar syncGraphPlayback = null;

`
);

/** Insert observer after hero lights */

const GRAPH_IO = `
  var graphInView = false;
  var graphRafId = 0;
  try {
    var graphIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (ent) {
          graphInView = ent.isIntersecting;
          if (syncGraphPlayback) syncGraphPlayback();
        });
      },
      { root: null, rootMargin: "80px", threshold: 0.06 }
    );
    graphIo.observe(wrap);
  } catch (_) {
    graphInView = true;
  }

`;

/** After gWhite add mq + IO before labelsDiv */
const gWhiteAnchor = `  gWhite.position.set(7, -3, 7);
  gScene.add(gWhite);

  var labelsDiv`;
if (!b.includes(gWhiteAnchor)) throw new Error("gWhite anchor not found");
b = b.replace(
  `  gWhite.position.set(7, -3, 7);
  gScene.add(gWhite);

  var labelsDiv`,
  `  gWhite.position.set(7, -3, 7);
  gScene.add(gWhite);

${GRAPH_IO.replace(/\n+$/, "")}
  mqMediaGraph = window.matchMedia("(prefers-reduced-motion: reduce)");

  var labelsDiv`
);

const heroOld =
  /  var heroT = 0;\r?\n  function heroAnimate\(\) \{\r?\n    requestAnimationFrame\(heroAnimate\);\r?\n    heroT \+= 0\.007;\r?\n([\s\S]*?)    lavLight\.intensity = 2 \+ Math\.sin\(heroT \* 0\.8\) \* 0\.7;\r?\n    renderer\.render\(scene, camera\);\r?\n  \}\r?\n  heroAnimate\(\);\r?\n\}\)\(\);/;

const mHero = heroOld.exec(b);
if (!mHero) throw new Error("Hero block regex failed");

const heroInner = mHero[1];

const heroNew = `
  var heroT = 0;
  var heroRafId = 0;

  function heroStepAnimated() {
    heroT += 0.007;
${heroInner}    lavLight.intensity = 2 + Math.sin(heroT * 0.8) * 0.7;
    renderer.render(scene, camera);
  }

  function heroRenderStillFrame() {
    camX += (tgX - camX) * 0.03;
    camY += (tgY - camY) * 0.03;
    camera.position.x = camX * 2.5;
    camera.position.y = -camY * 1.8;
    var sfHero = window.scrollY / ((document.body.scrollHeight - window.innerHeight) || 1);
    camera.position.z = 30 - sfHero * 14;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function heroCancelLoop() {
    cancelAnimationFrame(heroRafId);
    heroRafId = 0;
  }

  function heroLoopTick() {
    if (!heroShouldAnimate) return;
    heroStepAnimated();
    heroRafId = requestAnimationFrame(heroLoopTick);
  }

  /** @type {boolean} */
  var heroShouldAnimate = false;

  function syncHeroPlayback() {
    heroCancelLoop();
    __dbpaReducedMotionGraph =
      __dbpaReducedMotionHero || !!(mqMediaGraph && mqMediaGraph.matches);
    if (__dbpaReducedMotionHero) {
      heroShouldAnimate = false;
      heroRenderStillFrame();
    } else {
      heroShouldAnimate = __dbpaTabVisible;
      if (heroShouldAnimate) {
        heroRafId = requestAnimationFrame(heroLoopTick);
      } else {
        heroRenderStillFrame();
      }
    }
    if (syncGraphPlayback) syncGraphPlayback();
  }

  document.addEventListener("visibilitychange", function () {
    __dbpaTabVisible = document.visibilityState === "visible";
    syncHeroPlayback();
  });

  window.addEventListener(
    "scroll",
    function () {
      if (__dbpaReducedMotionHero) heroRenderStillFrame();
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    if (__dbpaReducedMotionHero) heroRenderStillFrame();
  });

  try {
    var mqHero = window.matchMedia("(prefers-reduced-motion: reduce)");
    mqHero.addEventListener("change", function () {
      __dbpaReducedMotionHero = mqHero.matches;
      syncHeroPlayback();
    });
    __dbpaReducedMotionHero = mqHero.matches;
  } catch (_) {
    __dbpaReducedMotionHero = false;
  }

  syncHeroPlayback();
})();
`;

b = b.replace(heroOld, heroNew.trim());

/** Graph RAF */
const graphOld =
  /\r?\n  var gT = 0;\r?\n  var proj = new THREE\.Vector3\(\);\r?\n  function graphAnimate\(\) \{\r?\n    requestAnimationFrame\(graphAnimate\);\r?\n    gT \+= 0\.008;\r?\n([\s\S]*?)    gr\.render\(gScene, gCam\);\r?\n  \}\r?\n  graphAnimate\(\);\r?\n\}\)\(\);/;

const mG = graphOld.exec(b);
if (!mG) throw new Error("Graph block regex failed");
const graphInner = mG[1];

const graphNew = `

  var gT = 0;
  var proj = new THREE.Vector3();

  function graphStepAnimated() {
    gT += 0.008;
${graphInner}    gr.render(gScene, gCam);
  }

  function graphRenderStillFrame() {
    resize();
    gr.render(gScene, gCam);
  }

  function graphCancelLoop() {
    cancelAnimationFrame(graphRafId);
    graphRafId = 0;
  }

  /** @type {boolean} */
  var graphPlaybackActive = false;

  function graphLoopTick() {
    if (!graphPlaybackActive) return;
    graphStepAnimated();
    graphRafId = requestAnimationFrame(graphLoopTick);
  }

  syncGraphPlayback = function () {
    graphCancelLoop();
    __dbpaReducedMotionGraph =
      __dbpaReducedMotionHero || !!(mqMediaGraph && mqMediaGraph.matches);

    graphPlaybackActive =
      __dbpaTabVisible && graphInView && !__dbpaReducedMotionGraph;

    if (!graphPlaybackActive) {
      graphRenderStillFrame();
      return;
    }
    graphRafId = requestAnimationFrame(graphLoopTick);
  };

  try {
    mqMediaGraph.addEventListener("change", function () {
      __dbpaReducedMotionGraph =
        __dbpaReducedMotionHero || !!(mqMediaGraph && mqMediaGraph.matches);
      syncGraphPlayback();
    });
  } catch (_) {}

  syncGraphPlayback();
})();
`;

b = b.replace(graphOld, graphNew.trim());

const mobileNavFn = `
function initDbpaMobileNav() {
  var toggle = document.getElementById("nav-mobile-toggle");
  var panel = document.getElementById("nav-mobile-panel");
  if (!toggle || !panel) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    panel.classList.toggle("open", !!open);
    panel.hidden = open ? false : true;
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("dbpa-nav-mobile-open", !!open);
  }

  setOpen(false);

  toggle.setAttribute(
    "aria-label",
    toggle.getAttribute("aria-expanded") === "true"
      ? "Close navigation menu"
      : "Open navigation menu"
  );
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    var openNow = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!openNow);
  });

  panel.addEventListener("click", function (e) {
    var t = /** @type {HTMLElement} */ (e.target);
    if (t && typeof t.closest === "function" && t.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 981px)").matches) setOpen(false);
  });
}

`;

b =
  mobileNavFn +
  b.replace(/if \('IntersectionObserver' in window\)/, `initDbpaMobileNav();\n\nif ('IntersectionObserver' in window)`);

const header =
  `/**\n * Landing page client runtime (motion-aware WebGL, i18n, nav).\n * Generated by scripts/compose-landing-init.mjs — edit the composer and re-run it.\n */\n` +
  `export function initLanding(THREE: typeof import("three")): void {\n`;

const footer = `\n}\n`;

const outfile = path.join(root, "src", "lib", "landing-client-init.ts");
fs.writeFileSync(outfile, header + b.trim() + footer);
console.log("wrote", outfile, "chars", outfile.length);
