import { useEffect, useState } from "react";
import ExperimentViewShell from "../../components/experiment/ExperimentViewShell";
import Button from "../../components/ui/Button";
import ForcedConclusionPhase from "./components/ForcedConclusionPhase";
import ForcedIntroPhase from "./components/ForcedIntroPhase";
import ForcedPracticePhase from "./components/ForcedPracticePhase";
import ForcedPreparationPhase from "./components/ForcedPreparationPhase";
import ForcedQuizPhase from "./components/ForcedQuizPhase";
import ForcedReportPhase from "./components/ForcedReportPhase";
import { useForcedController } from "./controller";
import { forcedPhases } from "./data";
import type { ForcedPhaseId } from "./model";
import "./forced-resonance.css";

export default function ForcedResonanceView() {
  const controller = useForcedController();
  const [workspaceExpanded, setWorkspaceExpanded] = useState(false);
  useEffect(() => {
    if (!workspaceExpanded) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setWorkspaceExpanded(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [workspaceExpanded]);
  const changePhase = (id: string) => {
    const phase = forcedPhases.find((item) => item.id === id);
    if (phase) { if (phase.id !== "prac") setWorkspaceExpanded(false); controller.goToPhase(phase.id); }
  };
  const renderPhase = (id: ForcedPhaseId) => {
    switch (id) {
      case "intro": return <ForcedIntroPhase onContinue={controller.goToNextPhase} />;
      case "prep": return <ForcedPreparationPhase onBack={controller.goToPreviousPhase} onContinue={controller.goToNextPhase} />;
      case "prac": return <ForcedPracticePhase runtime={controller.runtime} workspaceExpanded={workspaceExpanded} onToggleWorkspaceExpanded={() => setWorkspaceExpanded((value) => !value)} onTogglePlayback={controller.togglePlayback} onToggleCameraLock={controller.toggleCameraLock} onUpdatePendulum={controller.updatePendulum} onBack={controller.goToPreviousPhase} onContinue={() => { setWorkspaceExpanded(false); controller.goToNextPhase(); }} />;
      case "conc": return <ForcedConclusionPhase onBack={controller.goToPreviousPhase} onContinue={controller.goToNextPhase} />;
      case "test": return <ForcedQuizPhase assessment={controller.assessment} score={controller.score} onAnswer={controller.setAssessmentAnswer} onSubmit={controller.submitAssessment} onBack={controller.goToPreviousPhase} onContinue={controller.goToNextPhase} />;
      case "report": return <ForcedReportPhase onBack={controller.goToPreviousPhase} />;
    }
  };
  return <ExperimentViewShell viewClassName="forced-view" phases={forcedPhases} activePhase={controller.activePhase} onPhaseChange={changePhase} ariaLabel="Điều hướng thí nghiệm dao động cưỡng bức và cộng hưởng" workspaceExpanded={workspaceExpanded} isPractice={controller.activePhase === "prac"} utilityActions={<Button type="button" className="experiment-template__reset" onClick={() => { setWorkspaceExpanded(false); controller.resetExperiment(); }}>Đặt lại toàn bộ thí nghiệm</Button>}>
    {renderPhase(controller.activePhase)}
  </ExperimentViewShell>;
}
