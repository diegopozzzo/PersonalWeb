"use client";

import { useEffect, useRef } from "react";

type OverlayInstance = {
  destroy?: () => void;
} | null;

const STYLESHEET_ID = "dbpa-pokemon-overlay-styles";
const OVERLAY_ASSET_BASE = "/pokemon-overlay-kit-expanded";

function getAssetVersion() {
  return process.env.NODE_ENV === "production" ? "" : `?v=${Date.now()}`;
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

function getOverlayOptions(lang: "en" | "es") {
  const copy =
    lang === "es"
      ? {
          toolbarTitle: "Cursor roster",
          toolbarSubtitle: "12 Pokemon | abre el selector y cambia el cursor",
          toolbarToggleHide: "Ocultar",
          toolbarToggleShow: "Mostrar",
          toolbarHint: "Click o arrastra los Pokemon visibles",
          toolbarCreditsLabel: "Creditos",
          roleLabels: {
            mouse: "cursor",
            top: "header",
            bottom: "footer",
          },
          activeLabel: "cursor",
          badgePrefix: "Cursor",
        }
      : {
          toolbarTitle: "Cursor roster",
          toolbarSubtitle: "12 Pokemon | open the selector and switch the cursor",
          toolbarToggleHide: "Hide",
          toolbarToggleShow: "Show",
          toolbarHint: "Click or drag the visible Pokemon",
          toolbarCreditsLabel: "Credits",
          roleLabels: {
            mouse: "cursor",
            top: "header",
            bottom: "footer",
          },
          activeLabel: "cursor",
          badgePrefix: "Cursor",
        };

  return {
    cursorPokemon: "HONEDGE",
    topCompanions: [
      {
        pokemon: "GENGAR",
        anchorX: "4%",
        anchorY: "108px",
        size: 92,
        floatX: 12,
        floatY: 8,
        facing: "right",
      },
      {
        pokemon: "MEW",
        anchorX: "78%",
        anchorY: "118px",
        size: 82,
        floatX: 18,
        floatY: 12,
        facing: "left",
      },
      {
        pokemon: "LUCARIO",
        anchorX: "89%",
        anchorY: "154px",
        size: 98,
        floatX: 10,
        floatY: 7,
        facing: "left",
      },
    ],
    bottomWalkers: [
      {
        pokemon: "AXEW",
        startX: "5vw",
        minX: "2%",
        maxX: "18%",
        size: 90,
        speed: 22,
        floatY: 3,
        laneOffsetY: 8,
        direction: 1,
      },
      {
        pokemon: "CHARMANDER",
        startX: "28%",
        minX: "21%",
        maxX: "44%",
        size: 94,
        speed: 24,
        floatY: 3,
        laneOffsetY: 10,
        direction: 1,
      },
      {
        pokemon: "MACHOP",
        startX: "54%",
        minX: "49%",
        maxX: "70%",
        size: 96,
        speed: 26,
        floatY: 2,
        laneOffsetY: 10,
        direction: 1,
      },
      {
        pokemon: "SNORLAX",
        startX: "82%",
        minX: "76%",
        maxX: "95%",
        size: 114,
        speed: 14,
        floatY: 1,
        laneOffsetY: 12,
        direction: -1,
      },
    ],
    toolbarPokemon: [
      "HONEDGE",
      "GENGAR",
      "MACHOP",
      "AXEW",
      "PIKACHU",
      "EEVEE",
      "CHARMANDER",
      "BULBASAUR",
      "SQUIRTLE",
      "LUCARIO",
      "MEW",
      "SNORLAX",
    ],
    showToolbar: true,
    toolbarCollapsed: true,
    toolbarTitle: copy.toolbarTitle,
    toolbarSubtitle: copy.toolbarSubtitle,
    toolbarToggleHide: copy.toolbarToggleHide,
    toolbarToggleShow: copy.toolbarToggleShow,
    toolbarHint: copy.toolbarHint,
    toolbarCreditsLabel: copy.toolbarCreditsLabel,
    toolbarCreditsHref: "./CREDITS.md",
    toolbarRoleLabels: copy.roleLabels,
    activeLabel: copy.activeLabel,
    badgePrefix: copy.badgePrefix,
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
  };
}

export default function PokemonOverlayBridge() {
  const overlayRef = useRef<OverlayInstance>(null);
  const bootRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let resizeTimer = 0;

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
          createPokemonOverlay: (options: ReturnType<typeof getOverlayOptions>) => OverlayInstance;
        };

        if (cancelled || bootId !== bootRef.current) {
          return;
        }

        destroyOverlay();
        overlayRef.current = overlayModule.createPokemonOverlay(getOverlayOptions(lang));
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
        mountOverlay();
      }, 180);
    };

    const handleLanguageClick = () => {
      queueOverlayMount();
    };

    mountOverlay();

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
    };
  }, []);

  return null;
}

