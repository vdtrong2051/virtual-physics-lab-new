import { useRef, useState } from "react";
import { Link } from "react-router";

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const programMenuRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    setMenuOpen(false);

    if (programMenuRef.current) {
      programMenuRef.current.open = false;
    }
  }

  return (
    <header className="public-header">
      <div className="public-header__inner">

        <Link
          to="/"
          className="public-header__brand"
          onClick={closeMenu}
        >
          Virtual Physics Lab
        </Link>

        <button
          type="button"
          className="public-header__menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
        >
          ☰
        </button>

        <div
          className={`public-header__mobile-panel ${
            menuOpen ? "public-header__mobile-panel--open" : ""
          }`}
        >
          <nav className="public-header__nav">

            <a
              href="/#intro"
              onClick={closeMenu}
            >
              Giới thiệu
            </a>

            <details
              ref={programMenuRef}
              className="public-header__dropdown"
            >
              <summary className="public-header__dropdown-trigger">
                Chương trình
              </summary>

              <div className="public-header__dropdown-menu">

                <a
                  href="/#grade-10"
                  onClick={closeMenu}
                >
                  <strong>Vật lý 10</strong>
                  <span>Khám phá chương trình lớp 10</span>
                </a>

                <a
                  href="/#grade-11"
                  onClick={closeMenu}
                >
                  <strong>Vật lý 11</strong>
                  <span>Khám phá chương trình lớp 11</span>
                </a>

                <a
                  href="/#grade-12"
                  onClick={closeMenu}
                >
                  <strong>Vật lý 12</strong>
                  <span>Khám phá chương trình lớp 12</span>
                </a>

              </div>
            </details>

            <a
              href="/#lab-preview"
              onClick={closeMenu}
            >
              Trải nghiệm
            </a>

          </nav>

          <div className="public-header__actions">

            <Link
              to="/login"
              className="public-header__login"
              onClick={closeMenu}
            >
              Đăng nhập
            </Link>

            <Link
              to="/register"
              className="public-header__register"
              onClick={closeMenu}
            >
              Đăng ký miễn phí
            </Link>

          </div>
        </div>

      </div>
    </header>
  );
}