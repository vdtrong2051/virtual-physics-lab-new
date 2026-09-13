import { NavLink, Outlet } from "react-router";

import "../styles/app.css";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <NavLink to="/app">
            Virtual Physics Lab
          </NavLink>

          <span>Không gian học tập</span>
        </div>

        <nav
          className="app-sidebar__nav"
          aria-label="Điều hướng ứng dụng"
        >
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `app-sidebar__link ${
                isActive ? "app-sidebar__link--active" : ""
              }`
            }
          >
            <span className="app-sidebar__icon">⌂</span>

            <span>Trang chủ</span>
          </NavLink>

          <NavLink
            to="/app/experiments"
            className={({ isActive }) =>
              `app-sidebar__link ${
                isActive ? "app-sidebar__link--active" : ""
              }`
            }
          >
            <span className="app-sidebar__icon">⚗</span>

            <span>Thí nghiệm</span>
          </NavLink>
        </nav>

        <div className="app-sidebar__footer">
          <NavLink
            to="/"
            className="app-sidebar__back"
          >
            ← Trang giới thiệu
          </NavLink>
        </div>
      </aside>

      <div className="app-shell__body">
        <header className="app-header">
          <div className="app-header__context">
            <span className="app-header__eyebrow">
              VIRTUAL PHYSICS LAB
            </span>

            <strong>Không gian thực hành</strong>
          </div>

          <div className="app-header__account">
            <div className="app-header__avatar">
              U
            </div>

            <div className="app-header__account-text">
              <strong>Tài khoản</strong>
              <span>Thông tin sẽ nối Auth sau</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}