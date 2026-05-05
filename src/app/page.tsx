"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/LandingHero";
import { LANDING_HTML_HEAD, LANDING_HTML_REST } from "@/lib/landing-html";
import { initLanding } from "@/lib/landing-client-init";

const PokemonOverlayBridge = dynamic(() => import("@/components/PokemonOverlayBridge"), { ssr: false });

export default function Page() {
  useEffect(() => {
    let cancelled = false;
    const w = window as Window & { __dbpaLandingInit?: boolean };
    w.__dbpaLandingInit = false;

    void import("three").then((THREE) => {
      if (cancelled) return;
      initLanding(THREE);
    });

    return () => {
      cancelled = true;
      w.__dbpaLandingInit = false;
    };
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: LANDING_HTML_HEAD }} />
      <LandingHero />
      <div dangerouslySetInnerHTML={{ __html: LANDING_HTML_REST }} />
      <PokemonOverlayBridge />
    </>
  );
}
