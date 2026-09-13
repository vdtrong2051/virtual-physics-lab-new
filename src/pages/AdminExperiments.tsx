import { useMemo, useState } from "react";
import { Link } from "react-router";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageTitle from "../components/ui/PageTitle";

import { experiments } from "../experiments/registry";

import "../styles/admin-experiments.css";

const grades = [10, 11, 12] as const;

type GradeFilter = "all" | 10 | 11 | 12;

export default function AdminExperiments() {
  const [searchText, setSearchText] = useState("");
  const [activeGrade, setActiveGrade] =
    useState<GradeFilter>("all");

  const filteredExperiments = useMemo(() => {
    const normalizedSearch = searchText
      .trim()
      .toLowerCase();

    return experiments.filter((experiment) => {
      const matchesGrade =
        activeGrade === "all" ||
        experiment.grade === activeGrade;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        experiment.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        experiment.topic
          .toLowerCase()
          .includes(normalizedSearch) ||
        experiment.slug
          .toLowerCase()
          .includes(normalizedSearch) ||
        experiment.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesGrade && matchesSearch;
    });
  }, [activeGrade, searchText]);

  return (
    <div className="admin-experiments">
      <PageTitle
        title="Thí nghiệm"
        description="Theo dõi các bài thực hành đang được đăng ký trong Experiment Registry."
      />

      <section className="admin-experiments__notice">
        <Card className="admin-experiments__notice-card">
          <div>
            <span className="admin-experiments__notice-label">
              NGUỒN DỮ LIỆU
            </span>

            <h2>Experiment Registry</h2>

            <p>
              Danh mục hiện tại được đọc trực tiếp từ
              src/experiments/registry.ts. Chức năng tạo,
              chỉnh sửa và xóa sẽ được kích hoạt khi hoàn thiện
              tầng dữ liệu.
            </p>
          </div>

          <span className="admin-experiments__source">
            Registry
          </span>
        </Card>
      </section>

      <section className="admin-experiments__toolbar">
        <div className="admin-experiments__toolbar-left">
          <div className="admin-experiments__filters">
            <Button
              type="button"
              className={`admin-experiments__filter ${
                activeGrade === "all"
                  ? "admin-experiments__filter--active"
                  : ""
              }`}
              onClick={() => setActiveGrade("all")}
            >
              Tất cả
              <span>{experiments.length}</span>
            </Button>

            {grades.map((grade) => {
              const count = experiments.filter(
                (experiment) =>
                  experiment.grade === grade
              ).length;

              return (
                <Button
                  key={grade}
                  type="button"
                  className={`admin-experiments__filter ${
                    activeGrade === grade
                      ? "admin-experiments__filter--active"
                      : ""
                  }`}
                  onClick={() => setActiveGrade(grade)}
                >
                  Lớp {grade}
                  <span>{count}</span>
                </Button>
              );
            })}
          </div>

          <div className="admin-experiments__search">
            <Input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Tìm tên, slug hoặc chủ đề..."
              aria-label="Tìm kiếm thí nghiệm"
            />
          </div>
        </div>

        <Button
          type="button"
          disabled
          className="admin-experiments__create"
        >
          + Thêm thí nghiệm
        </Button>
      </section>

      <section className="admin-experiments__content">
        <Card className="admin-experiments__table-card">
          <div className="admin-experiments__table-header">
            <div>
              <h2>Danh mục thí nghiệm</h2>

              <p>
                {filteredExperiments.length} bài phù hợp
              </p>
            </div>

            <span className="admin-experiments__count">
              {filteredExperiments.length}
            </span>
          </div>

          <div className="admin-experiments__table-wrapper">
            <table className="admin-experiments__table">
              <thead>
                <tr>
                  <th>Thí nghiệm</th>
                  <th>Slug</th>
                  <th>Khối</th>
                  <th>Chủ đề</th>
                  <th>Quyền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredExperiments.length > 0 ? (
                  filteredExperiments.map(
                    (experiment) => (
                      <tr key={experiment.slug}>
                        <td>
                          <div className="admin-experiments__identity">
                            <strong>
                              {experiment.title}
                            </strong>

                            <span>
                              {experiment.description ??
                                "Chưa có mô tả."}
                            </span>
                          </div>
                        </td>

                        <td>
                          <code>
                            {experiment.slug}
                          </code>
                        </td>

                        <td>
                          Vật lý {experiment.grade}
                        </td>

                        <td>
                          {experiment.topic}
                        </td>

                        <td>
                          <span
                            className={`admin-experiments__access ${
                              experiment.isFree
                                ? "admin-experiments__access--free"
                                : "admin-experiments__access--full"
                            }`}
                          >
                            {experiment.isFree
                              ? "FREE"
                              : "FULL"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-experiments__actions">
                            <Link
                              to={`/app/experiments/${experiment.slug}`}
                            >
                              Mở
                            </Link>

                            <button
                              type="button"
                              disabled
                            >
                              Sửa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr className="admin-experiments__empty-row">
                    <td colSpan={6}>
                      <div className="admin-experiments__empty">
                        <strong>
                          Không tìm thấy thí nghiệm
                        </strong>

                        <p>
                          Thử thay đổi khối lớp hoặc từ khóa
                          tìm kiếm.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}