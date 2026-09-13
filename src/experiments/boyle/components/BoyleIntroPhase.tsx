import Button from "../../../components/ui/Button";

import { boyleIntroContent } from "../data";

type BoyleIntroPhaseProps = {
  onContinue: () => void;
};

export default function BoyleIntroPhase({
  onContinue,
}: BoyleIntroPhaseProps) {
  return (
    <div className="boyle-content-phase">
      <div className="boyle-content-phase__inner">
        <span className="boyle-content-phase__badge">
          Phần 1 · Lý thuyết cơ bản
        </span>

        <div className="boyle-intro__grid">
          <article className="boyle-info-card">
            <span
              className="boyle-info-card__icon"
              aria-hidden="true"
            >
              🌡️
            </span>

            <div>
              <h3>
                {boyleIntroContent.isothermalProcess.title}
              </h3>

              <p>
                {
                  boyleIntroContent.isothermalProcess
                    .description
                }
              </p>
            </div>
          </article>

          <article className="boyle-info-card">
            <span
              className="boyle-info-card__icon"
              aria-hidden="true"
            >
              📊
            </span>

            <div>
              <h3>{boyleIntroContent.graph.title}</h3>

              <p>
                {boyleIntroContent.graph.description}
              </p>
            </div>
          </article>
        </div>

        <section
          className="boyle-formula-card"
          aria-labelledby="boyle-formula-title"
        >
          <span
            id="boyle-formula-title"
            className="boyle-formula-card__label"
          >
            Công thức định luật Boyle-Mariotte
          </span>

          <div className="boyle-formula">
            {boyleIntroContent.formula}
          </div>

          <p>
            Trong đó <strong>p</strong> là áp suất và{" "}
            <strong>V</strong> là thể tích của một lượng
            khí xác định.
          </p>
        </section>

        <div className="boyle-phase-actions boyle-phase-actions--end">
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