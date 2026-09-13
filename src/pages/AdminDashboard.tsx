import { Link } from "react-router";

import Card from "../components/ui/Card";
import PageTitle from "../components/ui/PageTitle";

import { experiments } from "../experiments/registry";

import "../styles/admin-dashboard.css";

const grades = [10, 11, 12] as const;

export default function AdminDashboard() {
  const totalExperiments = experiments.length;

  const freeExperiments = experiments.filter(
    (experiment) => experiment.isFree
  ).length;

  const fullExperiments =
    totalExperiments - freeExperiments;

  const topicCount = new Set(
    experiments.map((experiment) => experiment.topic)
  ).size;

  return (
    <div className="admin-dashboard">
      <PageTitle
        title="Dashboard"
        description="Tổng quan nội dung và trạng thái quản trị Virtual Physics Lab."
      />

      <section className="admin-dashboard__stats">
        <Card className="admin-stat-card">
          <span className="admin-stat-card__label">
            Tổng thí nghiệm
          </span>

          <strong>{totalExperiments}</strong>

          <span className="admin-stat-card__meta">
            Đã đăng ký trong hệ thống
          </span>
        </Card>

        <Card className="admin-stat-card">
          <span className="admin-stat-card__label">
            Miễn phí
          </span>

          <strong>{freeExperiments}</strong>

          <span className="admin-stat-card__meta">
            Đang mở cho tài khoản FREE
          </span>
        </Card>

        <Card className="admin-stat-card">
          <span className="admin-stat-card__label">
            Toàn quyền
          </span>

          <strong>{fullExperiments}</strong>

          <span className="admin-stat-card__meta">
            Nội dung yêu cầu quyền FULL
          </span>
        </Card>

        <Card className="admin-stat-card">
          <span className="admin-stat-card__label">
            Chủ đề
          </span>

          <strong>{topicCount}</strong>

          <span className="admin-stat-card__meta">
            Chủ đề Vật lý hiện có
          </span>
        </Card>
      </section>

      <section className="admin-dashboard__section">
        <div className="admin-dashboard__section-header">
          <div>
            <h2>Chương trình thí nghiệm</h2>

            <p>
              Phân bố nội dung hiện có theo khối lớp.
            </p>
          </div>

          <Link
            to="/admin/experiments"
            className="admin-dashboard__section-link"
          >
            Quản lý thí nghiệm →
          </Link>
        </div>

        <div className="admin-dashboard__grade-grid">
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
                className="admin-grade-card"
              >
                <div className="admin-grade-card__top">
                  <span>VẬT LÝ {grade}</span>

                  <strong>
                    {gradeExperiments.length}
                  </strong>
                </div>

                <h3>Chương trình lớp {grade}</h3>

                {gradeExperiments.length > 0 ? (
                  <p>
                    {gradeExperiments.length} bài,
                    {" "}
                    {freeCount} bài miễn phí.
                  </p>
                ) : (
                  <p>
                    Chưa có thí nghiệm được đăng ký.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="admin-dashboard__section">
        <div className="admin-dashboard__section-header">
          <div>
            <h2>Quản trị hệ thống</h2>

            <p>
              Các khu vực quản trị đang có trong shell hiện tại.
            </p>
          </div>
        </div>

        <div className="admin-dashboard__management-grid">
          <Card className="admin-management-card">
            <div>
              <span className="admin-management-card__eyebrow">
                NGƯỜI DÙNG
              </span>

              <h3>Quản lý tài khoản</h3>

              <p>
                Danh sách và phân quyền người dùng sẽ được
                nối với Supabase Auth ở phase dữ liệu.
              </p>
            </div>

            <Link to="/admin/users">
              Mở quản lý người dùng →
            </Link>
          </Card>

          <Card className="admin-management-card">
            <div>
              <span className="admin-management-card__eyebrow">
                THÍ NGHIỆM
              </span>

              <h3>Quản lý nội dung</h3>

              <p>
                Kiểm tra các bài thực hành hiện được khai báo
                trong Experiment Registry.
              </p>
            </div>

            <Link to="/admin/experiments">
              Mở quản lý thí nghiệm →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}