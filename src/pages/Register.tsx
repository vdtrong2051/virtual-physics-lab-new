import type { FormEvent } from "react";
import { Link } from "react-router";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

import "../styles/auth.css";

export default function Register() {
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

            <h1>Bắt đầu thực hành Vật lý trực tuyến</h1>

            <p>
              Tạo tài khoản miễn phí để truy cập các bài thí nghiệm
              đang được mở và làm quen với quy trình thực hành
              trên nền tảng.
            </p>

            <div className="auth-card__preview">
              <div>
                <strong>Truy cập miễn phí</strong>
                <span>
                  Sử dụng các bài thí nghiệm đang được mở
                </span>
              </div>

              <div>
                <strong>Thực hành tương tác</strong>
                <span>
                  Quan sát, thao tác và đo đạc trực tiếp
                </span>
              </div>

              <div>
                <strong>Mở rộng quyền truy cập</strong>
                <span>
                  Tài khoản có thể được cấp thêm nội dung sau
                </span>
              </div>
            </div>
          </div>

          <div className="auth-card__form-wrapper">
            <div className="auth-card__form-header">
              <h2>Đăng ký tài khoản</h2>

              <p>
                Nhập thông tin để tạo tài khoản miễn phí.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <Input
                label="Họ và tên"
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                required
                className="auth-form__input"
              />

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
                autoComplete="new-password"
                placeholder="Tạo mật khẩu"
                minLength={6}
                required
                className="auth-form__input"
              />

              <Input
                label="Xác nhận mật khẩu"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                minLength={6}
                required
                className="auth-form__input"
              />

              <Button
                type="submit"
                className="auth-form__submit"
              >
                Đăng ký miễn phí
              </Button>
            </form>

            <p className="auth-card__register">
              Đã có tài khoản?{" "}
              <Link to="/login">
                Đăng nhập
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