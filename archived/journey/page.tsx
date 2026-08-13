import { DockNav } from "../components/DockNav";
import JourneyMap from "./JourneyMap";

export default function JourneyPage() {
  return (
    <main className="journey-page">
      <JourneyMap />
      <DockNav current="Journey" />
    </main>
  );
}
