# Node.js Blog API

Một RESTful API hoàn chỉnh cho hệ thống blog được xây dựng bằng Node.js, Express.js và MySQL.

## 🚀 Tính năng

### Xác thực & Ủy quyền
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập với JWT
- ✅ Middleware xác thực
- ✅ Bảo vệ các route cần thiết

### Quản lý bài viết
- ✅ CRUD operations cho bài viết
- ✅ Phân trang
- ✅ Tìm kiếm bài viết
- ✅ Lọc theo danh mục và tag
- ✅ Bài viết phổ biến và gần đây
- ✅ Auto-generate slug từ title
- ✅ Draft và Published status
- ✅ Đếm lượt xem

### Danh mục & Tags
- ✅ Quản lý danh mục
- ✅ Quản lý tags
- ✅ Liên kết bài viết với danh mục và tags

### Hệ thống bình luận
- ✅ CRUD operations cho bình luận
- ✅ Bình luận lồng nhau (replies)
- ✅ Quản lý trạng thái bình luận (approved/pending/spam)

### Validation & Error Handling
- ✅ Validation middleware cho tất cả input
- ✅ Error handling toàn cục
- ✅ Trả về lỗi có cấu trúc

## 📁 Cấu trúc dự án

```
nodejs/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── postController.js     # Posts logic
│   ├── categoryController.js # Categories & Tags logic
│   └── commentController.js  # Comments logic
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── errorHandel.js        # Global error handler
│   └── validation.js         # Input validation
├── model/
│   ├── userModel.js          # User database operations
│   ├── postModel.js          # Posts database operations
│   ├── categoryModel.js      # Categories & Tags operations
│   └── commentModel.js       # Comments database operations
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── postRoutes.js         # Posts routes
│   ├── categoryRoutes.js     # Categories & Tags routes
│   └── commentRoutes.js      # Comments routes
├── database/
│   └── schema.sql            # Database schema
├── uploads/                  # Static files directory
├── .env                      # Environment variables
├── server.js                 # Main server file
└── package.json             # Dependencies
```

## 🛠️ Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd d:\Nam_3\nodejs
npm install
```

### 2. Cấu hình database

Tạo database MySQL và chạy file schema:

```bash
mysql -u root -p
```

```sql
source database/schema.sql;
```

### 3. Cấu hình environment variables

Cập nhật file `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dblog
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Khởi chạy server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📖 API Documentation

### Authentication Routes

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Posts Routes

#### Lấy danh sách bài viết (có phân trang, tìm kiếm)
```http
GET /api/posts?page=1&limit=10&category=technology&tag=javascript&search=nodejs
```

#### Lấy bài viết theo ID
```http
GET /api/posts/1
```

#### Lấy bài viết theo slug
```http
GET /api/posts/slug/my-awesome-post
```

#### Tạo bài viết mới (cần đăng nhập)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Post",
  "content": "This is the content of my post...",
  "excerpt": "Short description",
  "status": "published",
  "category_id": 1,
  "tags": [1, 2, 3]
}
```

#### Cập nhật bài viết (cần đăng nhập)
```http
PUT /api/posts/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Post Title",
  "content": "Updated content...",
  "status": "published"
}
```

#### Xóa bài viết (cần đăng nhập)
```http
DELETE /api/posts/1
Authorization: Bearer <token>
```

#### Lấy bài viết phổ biến
```http
GET /api/posts/popular?limit=5
```

#### Lấy bài viết gần đây
```http
GET /api/posts/recent?limit=5
```

#### Lấy bài viết của tôi (cần đăng nhập)
```http
GET /api/posts/my/posts?page=1&limit=10
Authorization: Bearer <token>
```

### Categories & Tags Routes

#### Lấy danh sách danh mục
```http
GET /api/categories
```

#### Tạo danh mục mới (cần đăng nhập)
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology",
  "slug": "technology",
  "description": "Tech articles"
}
```

#### Lấy danh sách tags
```http
GET /api/tags
```

#### Tạo tag mới (cần đăng nhập)
```http
POST /api/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "JavaScript",
  "slug": "javascript"
}
```

### Comments Routes

#### Lấy bình luận của bài viết
```http
GET /api/posts/1/comments
```

#### Tạo bình luận mới (cần đăng nhập)
```http
POST /api/posts/1/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!",
  "parent_id": null
}
```

#### Cập nhật bình luận (cần đăng nhập)
```http
PUT /api/comments/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment"
}
```

#### Xóa bình luận (cần đăng nhập)
```http
DELETE /api/comments/1
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Tables:
- **users**: Thông tin người dùng
- **categories**: Danh mục bài viết
- **posts**: Bài viết
- **tags**: Tags
- **post_tags**: Liên kết bài viết và tags
- **comments**: Bình luận

## 🔒 Authentication

API sử dụng JWT (JSON Web Tokens) để xác thực. Sau khi đăng nhập thành công, bạn sẽ nhận được token. Sử dụng token này trong header `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Response Format

### Thành công:
```json
{
  "data": {...},
  "message": "Success message"
}
```

### Lỗi:
```json
{
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 🚀 Next Steps

Để phát triển thêm blog, bạn có thể:

1. **Frontend**: Tạo React/Vue.js frontend
2. **File Upload**: Thêm tính năng upload ảnh
3. **Email**: Gửi email thông báo
4. **Admin Panel**: Tạo trang quản trị
5. **SEO**: Thêm meta tags, sitemap
6. **Cache**: Redis cache cho performance
7. **Security**: Rate limiting, CORS, helmet
8. **Testing**: Unit tests và integration tests

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License.

---

**Tác giả:** [Tên của bạn]  
**Email:** [email của bạn]  
**Version:** 1.0.0
