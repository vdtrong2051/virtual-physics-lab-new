import { Link } from "react-router";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">

        <div className="public-footer__brand">
          <Link
            to="/"
            className="public-footer__logo"
          >
            Virtual Physics Lab
          </Link>

          <p className="public-footer__description">
            Phòng thí nghiệm vật lý trực tuyến hỗ trợ học tập
            và thực hành Vật lý THPT qua mô phỏng tương tác.
          </p>
        </div>

        <div className="public-footer__links">

          <div className="public-footer__group">
            <h3>Khám phá</h3>

            <a href="/#intro">
              Giới thiệu
            </a>

            <a href="/#curriculum">
              Chương trình
            </a>

            <a href="/#lab-preview">
              Trải nghiệm
            </a>
          </div>

          <div className="public-footer__group">
            <h3>Thực hành</h3>

            <Link to="/app">
              Không gian thực hành
            </Link>

            <Link to="/app/experiments">
              Danh sách thí nghiệm
            </Link>
          </div>

        </div>

      </div>

      <div className="public-footer__bottom">
        <span>
          © 2026 Virtual Physics Lab
        </span>

        <span>
          Hỗ trợ học tập và thực hành Vật lý THPT
        </span>
      </div>
    </footer>
  );
}