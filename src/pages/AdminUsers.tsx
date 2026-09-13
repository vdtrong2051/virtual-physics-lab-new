import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageTitle from "../components/ui/PageTitle";

import "../styles/admin-users.css";

export default function AdminUsers() {
  return (
    <div className="admin-users">
      <PageTitle
        title="Người dùng"
        description="Quản lý tài khoản và quyền truy cập Virtual Physics Lab."
      />

      <section className="admin-users__notice">
        <Card className="admin-users__notice-card">
          <div>
            <span className="admin-users__notice-label">
              NGUỒN DỮ LIỆU
            </span>

            <h2>Chưa kết nối hệ thống tài khoản</h2>

            <p>
              Danh sách người dùng sẽ được lấy từ Supabase Auth
              ở phase Auth/Data. Hiện tại trang này chỉ hoàn thiện
              giao diện quản trị.
            </p>
          </div>

          <span className="admin-users__status">
            Chưa kết nối
          </span>
        </Card>
      </section>

      <section className="admin-users__toolbar">
        <div className="admin-users__search">
          <Input
            type="search"
            placeholder="Tìm theo tên hoặc email..."
            aria-label="Tìm kiếm người dùng"
            disabled
          />
        </div>

        <Button
          type="button"
          disabled
        >
          + Thêm người dùng
        </Button>
      </section>

      <section className="admin-users__content">
        <Card className="admin-users__table-card">
          <div className="admin-users__table-header">
            <div>
              <h2>Danh sách người dùng</h2>

              <p>
                Dữ liệu sẽ xuất hiện sau khi Auth được kết nối.
              </p>
            </div>

            <span className="admin-users__count">
              —
            </span>
          </div>

          <div className="admin-users__table-wrapper">
            <table className="admin-users__table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Quyền truy cập</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                <tr className="admin-users__empty-row">
                  <td colSpan={5}>
                    <div className="admin-users__empty">
                      <strong>
                        Chưa có dữ liệu người dùng
                      </strong>

                      <p>
                        Trang quản trị đã sẵn sàng.
                        Dữ liệu thật sẽ được nạp từ Supabase Auth.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}