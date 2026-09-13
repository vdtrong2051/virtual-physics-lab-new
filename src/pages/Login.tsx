import type { FormEvent } from "react";
import { Link } from "react-router";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

import "../styles/auth.css";

export default function Login() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Phase Auth sau sẽ nối Supabase tại đây.
  }

  return (
    <section className="auth-page">
      <div className="auth-page__inner">
        <Card className="auth-card">

          <div className="auth-card__intro">
            <span className="auth-card__eyebrow">
              VIRTUAL PHYSICS LAB
            </span>

            <h1>Chào mừng bạn quay lại</h1>

            <p>
              Đăng nhập để tiếp tục truy cập các bài thực hành
              Vật lý và nội dung đã được cấp quyền.
            </p>

            <div className="auth-card__preview">
              <div>
                <strong>Vật lý 10–12</strong>
                <span>Chương trình thực hành THPT</span>
              </div>

              <div>
                <strong>Mô phỏng tương tác</strong>
                <span>Thao tác, đo đạc và phân tích</span>
              </div>

              <div>
                <strong>Lưu tiến trình</strong>
                <span>Sẽ được kích hoạt khi hoàn thiện tài khoản</span>
              </div>
            </div>
          </div>

          <div className="auth-card__form-wrapper">
            <div className="auth-card__form-header">
              <h2>Đăng nhập</h2>

              <p>Nhập thông tin tài khoản của bạn.</p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                className="auth-form__input"
              />

              <Input
                label="Mật khẩu"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                required
                className="auth-form__input"
              />

              <div className="auth-form__options">
                <label className="auth-form__remember">
                  <input
                    type="checkbox"
                    name="remember"
                  />

                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <button
                  type="button"
                  className="auth-form__forgot"
                  disabled
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                type="submit"
                className="auth-form__submit"
              >
                Đăng nhập
              </Button>
            </form>

            <p className="auth-card__register">
              Chưa có tài khoản?{" "}
              <Link to="/register">
                Đăng ký miễn phí
              </Link>
            </p>

            <Link
              to="/"
              className="auth-card__back"
            >
              ← Quay lại trang chủ
            </Link>
          </div>

        </Card>
      </div>
    </section>
  );
}