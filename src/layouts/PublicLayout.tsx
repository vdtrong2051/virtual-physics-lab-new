import { Outlet } from "react-router";

import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

import "../styles/landing.css";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicHeader />

      <main className="public-main">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}