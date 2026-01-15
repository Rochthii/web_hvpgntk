# 📋 Hướng Dẫn Import Tăng Sinh Từ Excel

Để nhập liệu hàng loạt Tăng sinh vào hệ thống, quý vị vui lòng tạo file Excel (`.xlsx`) theo đúng định dạng dưới đây.

## 1. Cấu trúc Cột (Bắt buộc tiêu đề chính xác)

Hàng đầu tiên của file Excel phải chứa các tiêu đề cột như sau:

| Mã Sinh Viên | Pháp Danh (Khmer) | Pháp Danh (Việt) | Ngày Sinh | Số Điện Thoại | Chùa Xuất Gia | Thế Danh | Email |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **K18001** | ភិក្ខុ វីរ៉ាក់ | Tỳ kheo Virắc | 15/04/2000 | 0909123456 | Chùa Candaransi | Thạch A | a@gmail.com |
| **K18002** | ភិក្ខុ សុខា | Tỳ kheo Sokha | 20/10/1999 | 0909999999 | Chùa Pothisomron | Sơn B | b@gmail.com |

## 2. Lưu ý quan trọng

*   **Mã Sinh Viên**: Phải là DUY NHẤT. Nếu trùng với mã đã có, hệ thống sẽ bỏ qua hoặc cập nhật (tùy cấu hình).
*   **Ngày Sinh**: Định dạng text kiểu `dd/mm/yyyy` (Ví dụ: `15/04/2000`).
*   **Tài khoản đăng nhập**:
    *   Hệ thống sẽ dùng **Mã Sinh Viên** để tạo Tên đăng nhập.
    *   Mật khẩu mặc định sẽ là **Ngày sinh** (viết liền, không dấu). Ví dụ: `15042000`.
*   **Số điện thoại**: Nên điền để Tăng sinh có thể khôi phục mật khẩu sau này.

## 3. Các bước thực hiện
1.  Truy cập Admin -> **Users** -> **Hồ sơ Tăng sinh**.
2.  Nhấn nút **IMPORT** (Nhập khẩu) ở góc trên bên phải.
3.  Chọn file Excel vừa chuẩn bị.
4.  Chọn định dạng **xlsx**.
5.  Nhấn **Submit**.
6.  Kiểm tra trang kết quả:
    *   Màu xanh lá: Thành công.
    *   Màu xám/đỏ: Bỏ qua hoặc lỗi (xem chi tiết thông báo).
