"use client";

import { useEffect, useRef } from "react";

type OverlayInstance = {
  destroy?: () => void;
} | null;

const STYLESHEET_ID = "dbpa-pokemon-overlay-styles";
const OVERLAY_ASSET_BASE = "/pokemon-overlay-kit-expanded";
const OVERLAY_CACHE_VERSION = "20260602i";
const OVERLAY_DISABLED_KEY = "dbpa_overlay_disabled";
const OVERLAY_LAUNCHER_ID = "dbpa-overlay-launcher";

function getAssetVersion() {
  return process.env.NODE_ENV === "production"
    ? `?v=${OVERLAY_CACHE_VERSION}`
    : `?v=${Date.now()}`;
}

function ensureStylesheet(version: string) {
  let link = document.getElementById(STYLESHEET_ID) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = STYLESHEET_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  link.href = `${OVERLAY_ASSET_BASE}/pokemon-overlay.css${version}`;

  return link;
}

function getCurrentLang(): "en" | "es" {
  try {
    const stored = window.localStorage.getItem("dbpa_lang");
    if (stored === "es") {
      return "es";
    }
  } catch (_error) {
    // ignore storage failures
  }

  return document.documentElement.lang === "es" ? "es" : "en";
}

function isDesktopOverlayAllowed() {
  return window.innerWidth > 1040 && !window.matchMedia("(pointer: coarse)").matches;
}

function isOverlayDisabled() {
  try {
    return window.localStorage.getItem(OVERLAY_DISABLED_KEY) === "1";
  } catch (_error) {
    return false;
  }
}

function setOverlayDisabled(value: boolean) {
  try {
    if (value) {
      window.localStorage.setItem(OVERLAY_DISABLED_KEY, "1");
      return;
    }

    window.localStorage.removeItem(OVERLAY_DISABLED_KEY);
  } catch (_error) {
    // ignore storage failures
  }
}

function getOverlayOptions(lang: "en" | "es") {
  const copy =
    lang === "es"
      ? {
          toolbarTitle: "Cursor roster",
          toolbarSubtitle: "14 Pokemon | abre el selector y cambia el cursor",
          toolbarToggleHide: "Ocultar",
          toolbarToggleShow: "Mostrar",
          toolbarHint: "Click o arrastra los Pokemon visibles",
          toolbarDisableLabel: "Desactivar",
          toolbarCreditsLabel: "Creditos",
          roleLabels: {
            mouse: "cursor",
            top: "header",
            bottom: "footer",
            header: "header",
            center: "core",
          },
          activeLabel: "cursor",
          badgePrefix: "Cursor",
        }
      : {
          toolbarTitle: "Cursor roster",
          toolbarSubtitle: "14 Pokemon | open the selector and switch the cursor",
          toolbarToggleHide: "Hide",
          toolbarToggleShow: "Show",
          toolbarHint: "Click or drag the visible Pokemon",
          toolbarDisableLabel: "Disable",
          toolbarCreditsLabel: "Credits",
          roleLabels: {
            mouse: "cursor",
            top: "header",
            bottom: "footer",
            header: "header",
            center: "core",
          },
          activeLabel: "cursor",
          badgePrefix: "Cursor",
        };

  return {
    cursorPokemon: "HONEDGE",
    topCompanions: [],
    centerCompanions: [],
    headerWalkers: [],
    bottomWalkers: [
      {
        pokemon: "KECLEON",
        startX: "8%",
        minX: "3%",
        maxX: "28%",
        size: 88,
        speed: 20,
        floatX: 8,
        floatY: 4,
        laneOffsetY: 8,
        direction: 1,
      },
      {
        pokemon: "CHARMANDER",
        startX: "38%",
        minX: "30%",
        maxX: "55%",
        size: 90,
        speed: 22,
        floatX: 8,
        floatY: 4,
        laneOffsetY: 10,
        direction: 1,
      },
      {
        pokemon: "MACHOP",
        startX: "68%",
        minX: "58%",
        maxX: "88%",
        size: 92,
        speed: 24,
        floatX: 8,
        floatY: 4,
        laneOffsetY: 10,
        direction: 1,
      },
    ],
    toolbarPokemon: [
      "HONEDGE",
      "GENGAR",
      "MACHOP",
      "KECLEON",
      "PIKACHU_LIBRE",
      "PIKACHU_SURFER",
      "EEVEE",
      "SQUIRTLE",
      "CHARMANDER",
      "MR_MIME",
      "MEOWTH_GALAR",
      "LUCARIO",
      "ARCHALUDON",
      "SNORLAX",
    ],
    showToolbar: true,
    toolbarCollapsed: true,
    toolbarTitle: copy.toolbarTitle,
    toolbarSubtitle: copy.toolbarSubtitle,
    toolbarToggleHide: copy.toolbarToggleHide,
    toolbarToggleShow: copy.toolbarToggleShow,
    toolbarHint: copy.toolbarHint,
    toolbarDisableLabel: copy.toolbarDisableLabel,
    toolbarCreditsLabel: copy.toolbarCreditsLabel,
    toolbarCreditsHref: "./CREDITS.md",
    toolbarRoleLabels: copy.roleLabels,
    activeLabel: copy.activeLabel,
    badgePrefix: copy.badgePrefix,
    showTour: false,
    themeClass: "dbpa-overlay",
    theme: {
      accent: "#FF6B2B",
      accent2: "#38d9b4",
      border: "rgba(255, 107, 43, 0.24)",
      surface: "rgba(7, 10, 16, 0.72)",
      panel:
        "linear-gradient(180deg, rgba(10, 12, 16, 0.88), rgba(7, 10, 16, 0.74))",
      text: "#f2f0ed",
      muted: "rgba(242, 240, 237, 0.7)",
      badgeBg: "rgba(10, 12, 16, 0.9)",
      glow: "rgba(255, 107, 43, 0.24)",
      glow2: "rgba(56, 217, 180, 0.18)",
    },
    cursorScale: 1.12,
    cursorOffsetX: -26,
    cursorOffsetY: -24,
    cursorSmoothing: 18,
    performance: {
      maxDpr: 1.25,
      targetFps: 30,
      lazyLoadActors: true,
      pauseWhenHidden: true,
      staggerActorMs: 200,
      walkerLoadDelayMs: 2400,
      pauseWalkersWhenArchVisible: true,
    },
  };
}

export default function PokemonOverlayBridge() {
  const overlayRef = useRef<OverlayInstance>(null);
  const bootRef = useRef(0);
  const launcherHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let resizeTimer = 0;

    const removeLauncher = () => {
      const launcher = document.getElementById(OVERLAY_LAUNCHER_ID);
      if (launcherHandlerRef.current && launcher) {
        launcher.removeEventListener("click", launcherHandlerRef.current);
      }
      launcherHandlerRef.current = null;
      launcher?.remove();
    };

    const ensureLauncher = () => {
      removeLauncher();

      if (!isDesktopOverlayAllowed() || !isOverlayDisabled()) {
        return;
      }

      const lang = getCurrentLang();
      const launcher = document.createElement("button");
      launcher.id = OVERLAY_LAUNCHER_ID;
      launcher.type = "button";
      launcher.textContent = lang === "es" ? "Activar Pokemon" : "Enable Pokemon";
      launcher.setAttribute("aria-label", launcher.textContent);
      launcher.style.position = "fixed";
      launcher.style.left = "22px";
      launcher.style.bottom = "22px";
      launcher.style.zIndex = "10030";
      launcher.style.padding = "0.78rem 1rem";
      launcher.style.border = "1px solid rgba(255, 107, 43, 0.24)";
      launcher.style.borderRadius = "999px";
      launcher.style.background =
        "linear-gradient(135deg, rgba(255, 107, 43, 0.18), rgba(56, 217, 180, 0.12)), rgba(10, 12, 16, 0.9)";
      launcher.style.color = "#f2f0ed";
      launcher.style.fontSize = "0.68rem";
      launcher.style.fontWeight = "700";
      launcher.style.letterSpacing = "0.12em";
      launcher.style.textTransform = "uppercase";
      launcher.style.boxShadow = "0 18px 40px rgba(0,0,0,0.28)";
      launcher.style.backdropFilter = "blur(16px)";

      const handleLauncherClick = () => {
        setOverlayDisabled(false);
        removeLauncher();
        void mountOverlay();
      };

      launcherHandlerRef.current = handleLauncherClick;
      launcher.addEventListener("click", handleLauncherClick);
      document.body.appendChild(launcher);
    };

    const destroyOverlay = () => {
      if (overlayRef.current?.destroy) {
        overlayRef.current.destroy();
      }
      overlayRef.current = null;
      document.body.classList.remove("pk-overlay-cursor-enabled");
    };

    const mountOverlay = async () => {
      const assetVersion = getAssetVersion();
      ensureStylesheet(assetVersion);

      if (!isDesktopOverlayAllowed()) {
        destroyOverlay();
        removeLauncher();
        return;
      }

      if (isOverlayDisabled()) {
        destroyOverlay();
        ensureLauncher();
        return;
      }

      const bootId = bootRef.current + 1;
      bootRef.current = bootId;
      const lang = getCurrentLang();

      try {
        const overlayModule = (await new Function(
          "assetUrl",
          "return import(assetUrl)"
        )(`${OVERLAY_ASSET_BASE}/pokemon-overlay.js${assetVersion}`)) as {
          createPokemonOverlay: (
            options: ReturnType<typeof getOverlayOptions> & { onDisable?: () => void }
          ) => OverlayInstance;
        };

        if (cancelled || bootId !== bootRef.current) {
          return;
        }

        removeLauncher();
        destroyOverlay();
        overlayRef.current = overlayModule.createPokemonOverlay({
          ...getOverlayOptions(lang),
          onDisable: () => {
            setOverlayDisabled(true);
            destroyOverlay();
            ensureLauncher();
          },
        });
      } catch (error) {
        console.error("Pokemon overlay failed to load", error);
      }
    };

    const queueOverlayMount = () => {
      window.setTimeout(() => {
        if (!cancelled) {
          mountOverlay();
        }
      }, 0);
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!isDesktopOverlayAllowed()) {
          destroyOverlay();
          ensureLauncher();
          return;
        }

        if (isOverlayDisabled()) {
          destroyOverlay();
          ensureLauncher();
          return;
        }

        if (overlayRef.current) {
          return;
        }

        mountOverlay();
      }, 180);
    };

    const handleLanguageClick = () => {
      if (isOverlayDisabled()) {
        ensureLauncher();
        return;
      }

      queueOverlayMount();
    };

    const scheduleMount = () => {
      const run = () => {
        if (!cancelled) {
          void mountOverlay();
        }
      };

      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(run, { timeout: 3200 });
      } else {
        setTimeout(run, 1200);
      }
    };

    scheduleMount();

    const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
    langButtons.forEach((button) => {
      button.addEventListener("click", handleLanguageClick);
    });

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      langButtons.forEach((button) => {
        button.removeEventListener("click", handleLanguageClick);
      });
      window.removeEventListener("resize", handleResize);
      destroyOverlay();
      removeLauncher();
    };
  }, []);

  return null;
}

