"use client";

import { useEffect, useState } from "react";
import { DockNav } from "../components/DockNav";
import {
  JourneyAccessDialog,
  journeyAccessKey,
} from "../components/JourneyAccessDialog";
import JourneyMap from "./JourneyMap";

export default function JourneyGate() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(window.sessionStorage.getItem(journeyAccessKey) === "true");
  }, []);

  if (unlocked) {
    return (
      <main className="journey-page">
        <JourneyMap />
        <DockNav current="Journey" />
      </main>
    );
  }

  return (
    <main className="journey-locked-page">
      <JourneyAccessDialog
        open={unlocked === false}
        onSuccess={() => setUnlocked(true)}
      />
      <DockNav current="Journey" />
    </main>
  );
}
