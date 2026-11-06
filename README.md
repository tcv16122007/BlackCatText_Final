# Black Cat Text - Fullstack Web Chat Application

## Hướng dẫn khởi chạy dự án

### Bước 1: Khởi động Database (SQL Server)
Yêu cầu: Máy tính đã cài đặt Docker Desktop.
Mở Terminal tại thư mục gốc của dự án và chạy:
`docker compose up -d`

### Bước 2: Khởi động Backend (Spring Boot)
Mở Terminal mới, di chuyển vào thư mục backend:
`cd backend`
Chạy lệnh:
`./gradlew bootRun`
*(Backend sẽ chạy ở cổng 8080)*

### Bước 3: Khởi động Frontend (Vite + TypeScript)
Mở Terminal mới, di chuyển vào thư mục frontend:
`cd frontend`
Cài đặt thư viện (chỉ chạy lần đầu):
`npm install`
Khởi chạy:
`npm run dev`
*(Truy cập http://localhost:5173 để sử dụng)*

## Tài khoản test thử
- Username: ...
- Password: ...