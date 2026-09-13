import { Link } from "react-router";

import Card from "../components/ui/Card";
import PageTitle from "../components/ui/PageTitle";

import { experiments } from "../experiments/registry";

import "../styles/home.css";

const grades = [10, 11, 12] as const;

export default function Home() {
  const totalExperiments = experiments.length;

  const freeExperiments = experiments.filter(
    (experiment) => experiment.isFree
  ).length;

  const featuredExperiments = experiments.slice(0, 3);

  return (
    <div className="home-page">
      <PageTitle
        title="Không gian thực hành"
        description="Khám phá các bài thí nghiệm Vật lý THPT và bắt đầu thực hành."
      />

      <section className="home-overview">
        <Card className="home-overview__card">
          <span className="home-overview__label">
            Tổng số thí nghiệm
          </span>

          <strong>{totalExperiments}</strong>

          <span className="home-overview__meta">
            Trong chương trình hiện tại
          </span>
        </Card>

        <Card className="home-overview__card">
          <span className="home-overview__label">
            Đang mở miễn phí
          </span>

          <strong>{freeExperiments}</strong>

          <span className="home-overview__meta">
            Có thể bắt đầu thực hành
          </span>
        </Card>

        <Card className="home-overview__card">
          <span className="home-overview__label">
            Khối lớp
          </span>

          <strong>3</strong>

          <span className="home-overview__meta">
            Vật lý 10, 11 và 12
          </span>
        </Card>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <div>
            <h2>Chương trình theo khối lớp</h2>

            <p>
              Chọn khối lớp để xem các bài thực hành tương ứng.
            </p>
          </div>

          <Link
            to="/app/experiments"
            className="home-section__link"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="home-grade-grid">
          {grades.map((grade) => {
            const gradeExperiments = experiments.filter(
              (experiment) => experiment.grade === grade
            );

            const freeCount = gradeExperiments.filter(
              (experiment) => experiment.isFree
            ).length;

            return (
              <Card
                key={grade}
                className="home-grade-card"
              >
                <div className="home-grade-card__top">
                  <span>VẬT LÝ {grade}</span>

                  <strong>
                    {gradeExperiments.length}
                  </strong>
                </div>

                <h3>Chương trình lớp {grade}</h3>

                {gradeExperiments.length > 0 ? (
                  <p>
                    {gradeExperiments.length} bài thực hành,
                    {" "}
                    {freeCount} bài đang mở miễn phí.
                  </p>
                ) : (
                  <p>
                    Nội dung đang được cập nhật.
                  </p>
                )}

                <Link
                  to={`/app/experiments?grade=${grade}`}
                  className="home-grade-card__link"
                >
                  Khám phá Vật lý {grade} →
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <div>
            <h2>Thí nghiệm hiện có</h2>

            <p>
              Một số bài thực hành đã được đăng ký trong hệ thống.
            </p>
          </div>
        </div>

        {featuredExperiments.length > 0 ? (
          <div className="home-experiment-grid">
            {featuredExperiments.map((experiment) => (
              <Card
                key={experiment.slug}
                className="home-experiment-card"
              >
                <div className="home-experiment-card__meta">
                  <span>
                    Vật lý {experiment.grade}
                  </span>

                  <span
                    className={
                      experiment.isFree
                        ? "home-experiment-card__access home-experiment-card__access--free"
                        : "home-experiment-card__access home-experiment-card__access--full"
                    }
                  >
                    {experiment.isFree ? "FREE" : "FULL"}
                  </span>
                </div>

                <h3>{experiment.title}</h3>

                <p>
                  {experiment.description ??
                    "Bài thực hành Vật lý trực tuyến."}
                </p>

                <Link
                  to={`/app/experiments/${experiment.slug}`}
                  className="home-experiment-card__link"
                >
                  Mở thí nghiệm →
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="home-empty">
            Chưa có thí nghiệm nào trong hệ thống.
          </Card>
        )}
      </section>
    </div>
  );
}