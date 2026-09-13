import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section
      id="intro"
      className="landing-hero"
    >
      <div className="landing-hero__inner">

        {/* Nội dung giới thiệu */}
        <div className="landing-hero__content">

          <p className="landing-hero__eyebrow">
            PHÒNG THÍ NGHIỆM VẬT LÝ TRỰC TUYẾN
          </p>

          <h1 className="landing-hero__title">
            Thực hành Vật lý THPT
            <span> qua mô phỏng tương tác</span>
          </h1>

          <p className="landing-hero__description">
            Virtual Physics Lab giúp người học quan sát hiện tượng,
            thao tác với thiết bị mô phỏng, đo đạc số liệu và phân tích
            kết quả trong các bài thực hành Vật lý lớp 10, 11 và 12.
          </p>

          {/* Tóm tắt trải nghiệm */}
          <div className="landing-hero__features">
            <span>Quan sát hiện tượng</span>
            <span>Thao tác mô phỏng</span>
            <span>Đo và ghi số liệu</span>
            <span>Phân tích kết quả</span>
          </div>

          {/* Hành động */}
          <div className="landing-hero__actions">
            <a
              href="#curriculum"
              className="landing-hero__primary-action"
            >
              Xem chương trình
            </a>

            <Link
              to="/register"
              className="landing-hero__secondary-action"
            >
              Đăng ký miễn phí
            </Link>
          </div>

        </div>

        {/* Preview sản phẩm */}
        <div className="landing-hero__visual">

          <div className="landing-hero__preview">

            <div className="landing-hero__preview-header">
              <div>
                <span className="landing-hero__preview-dot" />
                <span className="landing-hero__preview-dot" />
                <span className="landing-hero__preview-dot" />
              </div>

              <span>
                Virtual Physics Lab
              </span>
            </div>

            <div className="landing-hero__preview-body">

              <div className="landing-hero__preview-scene">
                <span>
                  Khu vực mô phỏng thí nghiệm
                </span>
              </div>

              <div className="landing-hero__preview-controls">
                <div>
                  <strong>Thông số</strong>
                  <span>Điều chỉnh đại lượng</span>
                </div>

                <div>
                  <strong>Đo đạc</strong>
                  <span>Thu thập số liệu</span>
                </div>

                <div>
                  <strong>Kết quả</strong>
                  <span>Phân tích thực nghiệm</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}