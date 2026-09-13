import { Link, Outlet, useParams } from "react-router";

import Card from "../components/ui/Card";

import { getExperimentBySlug } from "../experiments/registry";

import "../styles/experiment.css";

function getTopicAccentClass(topic: string) {
  const normalizedTopic = topic
    .trim()
    .toLowerCase();

  if (normalizedTopic.includes("nhiệt")) {
    return "experiment-page--thermal";
  }

  if (normalizedTopic.includes("khí")) {
    return "experiment-page--gas";
  }

  if (
    normalizedTopic.includes("từ") ||
    normalizedTopic.includes("điện từ")
  ) {
    return "experiment-page--magnetic";
  }

  if (
    normalizedTopic.includes("hạt nhân") ||
    normalizedTopic.includes("phóng xạ")
  ) {
    return "experiment-page--nuclear";
  }

  return "experiment-page--default";
}

export default function ExperimentLayout() {
  const { slug } = useParams();

  const experiment = slug
    ? getExperimentBySlug(slug)
    : undefined;

  if (!experiment) {
    return (
      <div className="experiment-page experiment-page--not-found">
        <Card className="experiment-not-found">
          <span className="experiment-not-found__code">
            404
          </span>

          <h1>Không tìm thấy thí nghiệm</h1>

          <p>
            Bài thí nghiệm bạn đang truy cập không tồn tại
            trong danh mục hiện tại.
          </p>

          <Link
            to="/app/experiments"
            className="experiment-not-found__back"
          >
            ← Quay lại danh sách thí nghiệm
          </Link>
        </Card>
      </div>
    );
  }

  const topicAccentClass =
    getTopicAccentClass(experiment.topic);

  return (
    <div
      className={`experiment-page ${topicAccentClass}`}
    >
      <header className="experiment-header">
        <Link
          to="/app/experiments"
          className="experiment-header__back"
        >
          <span aria-hidden="true">←</span>

          <span>Quay lại</span>
        </Link>

        <div className="experiment-header__identity">
          <div className="experiment-header__meta">
            <span className="experiment-header__subject">
              Vật lý {experiment.grade} · {experiment.topic}
            </span>

            <span
              className="experiment-header__indicator"
              aria-hidden="true"
            />

            <span className="experiment-header__lab-label">
              Phòng thí nghiệm ảo
            </span>

            <span
              className={`experiment-header__access ${
                experiment.isFree
                  ? "experiment-header__access--free"
                  : "experiment-header__access--full"
              }`}
            >
              {experiment.isFree ? "FREE" : "FULL"}
            </span>
          </div>

          <h1>{experiment.title}</h1>

          {experiment.description && (
            <p className="experiment-header__description">
              {experiment.description}
            </p>
          )}
        </div>
      </header>

      <main className="experiment-main">
        <section className="experiment-workspace">
          <Outlet />
        </section>
      </main>
    </div>
  );
}