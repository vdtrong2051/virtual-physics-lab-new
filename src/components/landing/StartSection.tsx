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
            Bắt đầu thực hành theo cách phù hợp với bạn
          </h2>

          <p className="landing-start__description">
            Bạn có thể đăng ký tài khoản miễn phí để sử dụng các
            thí nghiệm đang được mở, hoặc đăng nhập bằng tài khoản
            đã được cấp quyền để truy cập đầy đủ nội dung.
          </p>
        </div>

        <div className="landing-start__options">

          <div className="landing-start__option">
            <span className="landing-start__option-label">
              TÀI KHOẢN MIỄN PHÍ
            </span>

            <h3>
              Tự đăng ký và bắt đầu ngay
            </h3>

            <ul>
              <li>
                Sử dụng các bài thí nghiệm đang được mở miễn phí
              </li>

              <li>
                Làm quen với quy trình thực hành trên nền tảng
              </li>

              <li>
                Có thể nâng quyền truy cập sau
              </li>
            </ul>

            <Link
              to="/register"
              className="landing-start__primary-action"
            >
              Đăng ký miễn phí
            </Link>
          </div>

          <div className="landing-start__option">
            <span className="landing-start__option-label">
              TÀI KHOẢN ĐƯỢC CẤP QUYỀN
            </span>

            <h3>
              Truy cập đầy đủ chương trình
            </h3>

            <ul>
              <li>
                Sử dụng toàn bộ các bài được cấp quyền
              </li>

              <li>
                Truy cập đầy đủ nội dung thực hành
              </li>

              <li>
                Phù hợp với tài khoản do quản trị viên cấp
              </li>
            </ul>

            <Link
              to="/login"
              className="landing-start__secondary-action"
            >
              Đăng nhập
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}