
import HeroSection from "../components/landing/HeroSection";
import CurriculumSection from "../components/landing/CurriculumSection";
import LabPreviewSection from "../components/landing/LabPreviewSection";
import StartSection from "../components/landing/StartSection";

export default function Landing() {
  return (
    <div className="landing-page">
      <HeroSection />

      <CurriculumSection />

      <LabPreviewSection />

      <StartSection />
    </div>
  );
}