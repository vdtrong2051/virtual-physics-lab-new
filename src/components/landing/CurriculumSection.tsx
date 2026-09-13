import { Link } from "react-router";

import { experiments } from "../../experiments/registry";

const grades = [10, 11, 12] as const;

export default function CurriculumSection() {
  return (
    <section
      id="curriculum"
      className="landing-curriculum"
    >
      <div className="landing-curriculum__inner">

        {/* Tiêu đề section */}
        <div className="landing-curriculum__header">
          <p className="landing-curriculum__eyebrow">
            CHƯƠNG TRÌNH THÍ NGHIỆM
          </p>

          <h2 className="landing-curriculum__title">
            Thực hành Vật lý theo chương trình THPT
          </h2>

          <p className="landing-curriculum__description">
            Khám phá các bài thực hành được tổ chức theo
            chương trình Vật lý lớp 10, 11 và 12.
          </p>
        </div>

        {/* Ba khối lớp */}
        <div className="landing-curriculum__grid">
          {grades.map((grade) => {
            const gradeExperiments = experiments.filter(
              (experiment) => experiment.grade === grade
            );

            const topics = [
              ...new Set(
                gradeExperiments.map(
                  (experiment) => experiment.topic
                )
              ),
            ];

            const freeCount = gradeExperiments.filter(
              (experiment) => experiment.isFree
            ).length;

            return (
              <article
                key={grade}
                id={`grade-${grade}`}
                className="landing-curriculum__card"
              >
                <div className="landing-curriculum__card-top">
                  <span className="landing-curriculum__grade">
                    VẬT LÝ {grade}
                  </span>

                  {gradeExperiments.length > 0 && (
                    <span className="landing-curriculum__total">
                      {gradeExperiments.length} bài
                    </span>
                  )}
                </div>

                <h3>
                  Chương trình lớp {grade}
                </h3>

                {/* Chủ đề có thật trong registry */}
                <div className="landing-curriculum__topics">
                  {topics.length > 0 ? (
                    topics.map((topic) => (
                      <span
                        key={topic}
                        className="landing-curriculum__topic"
                      >
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="landing-curriculum__empty">
                      Nội dung đang được cập nhật
                    </span>
                  )}
                </div>

                {/* Thông tin ngắn */}
                {gradeExperiments.length > 0 && (
                  <p className="landing-curriculum__meta">
                    {freeCount} bài đang được mở miễn phí
                  </p>
                )}

                <Link
                  to={`/app/experiments?grade=${grade}`}
                  className="landing-curriculum__link"
                >
                  Khám phá Vật lý {grade}
                  <span aria-hidden="true"> →</span>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Đi tới toàn bộ danh mục */}
        <div className="landing-curriculum__footer">
          <Link
            to="/app/experiments"
            className="landing-curriculum__all"
          >
            Xem toàn bộ chương trình thí nghiệm
          </Link>
        </div>

      </div>
    </section>
  );
}