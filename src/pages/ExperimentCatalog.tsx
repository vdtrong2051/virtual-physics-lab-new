import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageTitle from "../components/ui/PageTitle";

import { experiments } from "../experiments/registry";

import "../styles/catalog.css";

const grades = [10, 11, 12] as const;

type GradeFilter = "all" | 10 | 11 | 12;

export default function ExperimentCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");

  const gradeParam = Number(searchParams.get("grade"));

  const activeGrade: GradeFilter =
    gradeParam === 10 || gradeParam === 11 || gradeParam === 12
      ? gradeParam
      : "all";

  function changeGrade(grade: GradeFilter) {
    const nextParams = new URLSearchParams(searchParams);

    if (grade === "all") {
      nextParams.delete("grade");
    } else {
      nextParams.set("grade", String(grade));
    }

    setSearchParams(nextParams);
  }

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
        experiment.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesGrade && matchesSearch;
    });
  }, [activeGrade, searchText]);

  return (
    <div className="catalog-page">
      <PageTitle
        title="Thí nghiệm"
        description="Khám phá các bài thực hành Vật lý lớp 10, 11 và 12."
      />

      <section className="catalog-toolbar">
        <div className="catalog-toolbar__filters">
          <button
            type="button"
            className={`catalog-filter ${
              activeGrade === "all"
                ? "catalog-filter--active"
                : ""
            }`}
            onClick={() => changeGrade("all")}
          >
            Tất cả
            <span>{experiments.length}</span>
          </button>

          {grades.map((grade) => {
            const count = experiments.filter(
              (experiment) =>
                experiment.grade === grade
            ).length;

            return (
              <button
                key={grade}
                type="button"
                className={`catalog-filter ${
                  activeGrade === grade
                    ? "catalog-filter--active"
                    : ""
                }`}
                onClick={() => changeGrade(grade)}
              >
                Vật lý {grade}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="catalog-toolbar__search">
          <Input
            type="search"
            name="experimentSearch"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Tìm theo tên hoặc chủ đề..."
            aria-label="Tìm kiếm thí nghiệm"
          />
        </div>
      </section>

      <section className="catalog-results">
        <div className="catalog-results__header">
          <div>
            <h2>
              {activeGrade === "all"
                ? "Tất cả thí nghiệm"
                : `Vật lý ${activeGrade}`}
            </h2>

            <p>
              {filteredExperiments.length} bài phù hợp
            </p>
          </div>
        </div>

        {filteredExperiments.length > 0 ? (
          <div className="catalog-grid">
            {filteredExperiments.map(
              (experiment) => (
                <Card
                  key={experiment.slug}
                  className="catalog-card"
                >
                  <div className="catalog-card__top">
                    <div className="catalog-card__meta">
                      <span>
                        Vật lý {experiment.grade}
                      </span>

                      <span>•</span>

                      <span>
                        {experiment.topic}
                      </span>
                    </div>

                    <span
                      className={`catalog-card__access ${
                        experiment.isFree
                          ? "catalog-card__access--free"
                          : "catalog-card__access--full"
                      }`}
                    >
                      {experiment.isFree
                        ? "FREE"
                        : "FULL"}
                    </span>
                  </div>

                  <div className="catalog-card__body">
                    <h3>{experiment.title}</h3>

                    <p>
                      {experiment.description ??
                        "Bài thực hành Vật lý trực tuyến."}
                    </p>
                  </div>

                  <Link
                    to={`/app/experiments/${experiment.slug}`}
                    className="catalog-card__action"
                  >
                    Mở thí nghiệm
                    <span aria-hidden="true">→</span>
                  </Link>
                </Card>
              )
            )}
          </div>
        ) : (
          <Card className="catalog-empty">
            <strong>
              Không tìm thấy thí nghiệm
            </strong>

            <p>
              Thử thay đổi khối lớp hoặc từ khóa tìm kiếm.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}