import { Link, NavLink, Outlet } from "react-router";

import "../styles/admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <strong>Virtual Physics Lab</strong>
          <span>Quản trị hệ thống</span>
        </div>

        <nav className="admin-sidebar__nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`
            }
          >
            <span className="admin-sidebar__icon">
              ◫
            </span>

            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`
            }
          >
            <span className="admin-sidebar__icon">
              ♙
            </span>

            <span>Người dùng</span>
          </NavLink>

          <NavLink
            to="/admin/experiments"
            className={({ isActive }) =>
              `admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`
            }
          >
            <span className="admin-sidebar__icon">
              ◉
            </span>

            <span>Thí nghiệm</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/app">
            ← Không gian thực hành
          </Link>
        </div>
      </aside>

      <div className="admin-shell">

        <header className="admin-topbar">
          <div className="admin-topbar__context">
            <span>VIRTUAL PHYSICS LAB</span>
            <strong>Trung tâm quản trị</strong>
          </div>

          <div className="admin-topbar__account">
            <div className="admin-topbar__avatar">
              A
            </div>

            <div>
              <strong>Quản trị viên</strong>
              <span>Thông tin sẽ nối Auth sau</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}