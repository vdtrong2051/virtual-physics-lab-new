import { Link } from "react-router";

export default function StartSection() {
  return (
    <section
      id="start"
      className="landing-start"
    >
      <div className="landing-start__inner">

        <div className="landing-start__content">
          <p className="landing-start__eyebrow">
            BẮT ĐẦU SỬ DỤNG
          </p>

          <h2 className="landing-start__title">
            Bắt đầu khám phá phòng thí nghiệm Vật lý
          </h2>

          <p className="landing-start__description">
            Khám phá các bài thí nghiệm Vật lý THPT, lựa chọn
            nội dung phù hợp và bắt đầu thực hành trực tiếp
            trên nền tảng.
          </p>
        </div>

        <div className="landing-start__options">

          <div className="landing-start__option">
            <span className="landing-start__option-label">
              PHÒNG THÍ NGHIỆM
            </span>

            <h3>
              Chọn bài và bắt đầu thực hành
            </h3>

            <ul>
              <li>
                Khám phá các bài thí nghiệm hiện có
              </li>

              <li>
                Tương tác trực tiếp với mô hình vật lý
              </li>

              <li>
                Quan sát, đo đạc và phân tích kết quả
              </li>
            </ul>

            <Link
              to="/app/experiments"
              className="landing-start__primary-action"
            >
              Xem thí nghiệm
            </Link>
          </div>

          <div className="landing-start__option">
            <span className="landing-start__option-label">
              CHƯƠNG TRÌNH THPT
            </span>

            <h3>
              Khám phá theo khối lớp
            </h3>

            <ul>
              <li>
                Nội dung Vật lý lớp 10, 11 và 12
              </li>

              <li>
                Các thí nghiệm được tổ chức theo chủ đề
              </li>

              <li>
                Dễ dàng lựa chọn nội dung cần thực hành
              </li>
            </ul>

            <a
              href="/#curriculum"
              className="landing-start__secondary-action"
            >
              Xem chương trình
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}