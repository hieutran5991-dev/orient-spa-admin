# Hướng Dẫn Thiết Lập Google OAuth

## 1. Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API
4. Vào "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm Authorized JavaScript origins:
   - `http://localhost:3000` (cho development)
   - `https://yourdomain.com` (cho production)
7. Thêm Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`
8. Copy Client ID

## 2. Cấu Hình Biến Môi Trường

Tạo file `.env.local` trong thư mục gốc của project:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Laravel API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Cấu Hình Laravel Server

Đảm bảo Laravel server của bạn có các endpoint sau:

### GET /auth/google/redirect
Trả về URL để redirect user đến Google OAuth:
```json
{
  "url": "https://accounts.google.com/oauth/authorize?..."
}
```

### POST /auth/google/callback
Nhận credential từ Google và xử lý authentication:
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Trả về thông tin user và token:
```json
{
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://..."
  },
  "token": "your_jwt_token_here"
}
```

## 4. Cài Đặt Dependencies

Các dependencies đã được cài đặt sẵn:
- `@react-oauth/google`: ^0.12.2

## 5. Cấu Trúc Files

- `src/context/AuthContext.tsx`: Quản lý authentication state
- `src/services/authService.ts`: Service để giao tiếp với Laravel API
- `src/components/auth/SignInForm.tsx`: Component đăng nhập với Google
- `src/app/layout.tsx`: Layout chính với GoogleOAuthProvider

## 6. Sử Dụng

1. User click vào button "Sign in with Google"
2. Google OAuth popup xuất hiện
3. User đăng nhập với Google
4. Google trả về credential
5. Frontend gửi credential đến Laravel server
6. Laravel server xử lý và trả về user info + token
7. Frontend lưu token và redirect user đến dashboard

## 7. Lưu Ý Bảo Mật

- Luôn sử dụng HTTPS trong production
- Validate token ở server side
- Implement proper error handling
- Sử dụng environment variables cho sensitive data
- Implement proper logout functionality
