import Button from "../../../components/ui/Button";

import { jouleIntroContent } from "../data";

type JouleIntroPhaseProps = {
  onContinue: () => void;
};

export default function JouleIntroPhase({
  onContinue,
}: JouleIntroPhaseProps) {
  return (
    <div className="joule-content-phase">
      <div className="joule-content-phase__inner">
        <span className="joule-content-phase__badge">
          Phần 1 · Lý thuyết cơ bản
        </span>

        <div className="joule-intro__grid">
          <article className="joule-info-card">
            <span
              className="joule-info-card__icon"
              aria-hidden="true"
            >
              ⚙️
            </span>

            <div>
              <h3>
                {
                  jouleIntroContent
                    .mechanicalToThermalEnergy
                    .title
                }
              </h3>

              <p>
                {
                  jouleIntroContent
                    .mechanicalToThermalEnergy
                    .description
                }
              </p>
            </div>
          </article>

          <article className="joule-info-card">
            <span
              className="joule-info-card__icon"
              aria-hidden="true"
            >
              ⚖️
            </span>

            <div>
              <h3>
                {
                  jouleIntroContent
                    .mechanicalEquivalentOfHeat
                    .title
                }
              </h3>

              <p>
                {
                  jouleIntroContent
                    .mechanicalEquivalentOfHeat
                    .description
                }
              </p>
            </div>
          </article>
        </div>

        <section
          className="joule-formula-card"
          aria-labelledby="joule-formula-title"
        >
          <span
            id="joule-formula-title"
            className="joule-formula-card__label"
          >
            {jouleIntroContent.firstLaw.title}
          </span>

          <div className="joule-formula">
            {jouleIntroContent.firstLaw.formula}
          </div>

          <div className="joule-formula joule-formula--secondary">
            {
              jouleIntroContent.firstLaw
                .experimentFormula
            }
          </div>

          <p>
            {jouleIntroContent.firstLaw.description}
          </p>

          <p className="joule-formula-card__note">
            {jouleIntroContent.firstLaw.massNote}
          </p>
        </section>

        <div className="joule-phase-actions joule-phase-actions--end">
          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            onClick={onContinue}
          >
            Tiến hành chuẩn bị
          </Button>
        </div>
      </div>
    </div>
  );
}
