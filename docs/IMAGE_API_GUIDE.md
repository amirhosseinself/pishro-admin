# راهنمای API مدیریت تصاویر

این راهنما برای استفاده از API مدیریت تصاویر در CMS نوشته شده است.

## 📦 ذخیره‌سازی تصاویر

تصاویر به صورت محلی روی سرور ذخیره می‌شوند:

- **مسیر ذخیره**: `public/uploads/images/{category}/{filename}`
- **URL دسترسی**: `/uploads/images/{category}/{filename}`
- **نوع دسترسی**: عمومی (Public)
- **نیاز به احراز هویت**: خیر (فقط برای آپلود و مدیریت نیاز است)

⚠️ **توجه**: دیگر نیازی به تنظیمات S3 Object Storage نیست.

## دسته‌بندی تصاویر (ImageCategory)

```typescript
enum ImageCategory {
  PROFILE      // تصویر پروفایل کاربران
  COURSE       // تصاویر دوره‌ها
  BOOK         // تصاویر کتاب‌ها
  NEWS         // تصاویر اخبار
  RESUME       // تصاویر رزومه
  CERTIFICATE  // تصاویر گواهینامه
  TEAM         // تصاویر اعضای تیم
  LANDING      // تصاویر صفحات لندینگ
  OTHER        // سایر موارد
}
```

## Endpoints

### 1. آپلود تصویر

```
POST /api/admin/images
Content-Type: multipart/form-data
```

**Body (FormData):**

- `file` (File, required): فایل تصویر (JPG, PNG, GIF, WEBP, SVG - حداکثر 10MB)
- `category` (string, required): دسته‌بندی (از لیست ImageCategory)
- `title` (string, optional): عنوان تصویر
- `description` (string, optional): توضیحات
- `alt` (string, optional): متن جایگزین برای SEO
- `tags` (string, optional): تگ‌ها (جدا شده با کاما)

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "67abc123...",
    "filePath": "images/course/abc123_1234567890.jpg",
    "fileName": "example.jpg",
    "url": "/uploads/images/course/abc123_1234567890.jpg"
  },
  "message": "تصویر با موفقیت آپلود شد"
}
```

### 2. لیست تصاویر

```
GET /api/admin/images?page=1&limit=20&category=COURSE&search=keyword
```

**Query Parameters:**

- `page` (number, optional): شماره صفحه (پیش‌فرض: 1)
- `limit` (number, optional): تعداد در هر صفحه (پیش‌فرض: 20, حداکثر: 100)
- `category` (ImageCategory, optional): فیلتر بر اساس دسته
- `search` (string, optional): جستجو در عنوان، توضیحات و نام فایل

**Response:**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "67abc123...",
        "title": "عنوان تصویر",
        "fileName": "example.jpg",
        "filePath": "images/course/abc123_1234567890.jpg",
        "fileSize": 123456,
        "mimeType": "image/jpeg",
        "width": 1920,
        "height": 1080,
        "category": "COURSE",
        "tags": ["دوره", "آموزش"],
        "url": "/uploads/images/course/abc123_1234567890.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 3. دریافت اطلاعات یک تصویر

```
GET /api/admin/images/:id
```

**Response:** همانند یک آیتم از لیست

### 4. به‌روزرسانی تصویر

```
PATCH /api/admin/images/:id
Content-Type: application/json
```

**Body:**

```json
{
  "title": "عنوان جدید",
  "description": "توضیحات جدید",
  "alt": "متن جایگزین",
  "tags": ["تگ1", "تگ2"],
  "category": "BOOK",
  "published": true
}
```

### 5. حذف تصویر

```
DELETE /api/admin/images/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  },
  "message": "تصویر با موفقیت حذف شد"
}
```

### 6. آمار تصاویر

```
GET /api/admin/images/stats
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "total": 150,
    "byCategory": [
      { "category": "COURSE", "count": 50 },
      { "category": "BOOK", "count": 30 }
    ],
    "totalSize": 52428800
  }
}
```

## نمونه استفاده در CMS

### آپلود تصویر برای دوره:

```javascript
const formData = new FormData();
formData.append("file", imageFile);
formData.append("category", "COURSE");
formData.append("title", "کاور دوره بورس");
formData.append("alt", "تصویر کاور دوره آموزش بورس");
formData.append("tags", "بورس,آموزش,دوره");

const response = await fetch("/api/admin/images", {
  method: "POST",
  body: formData,
});

const result = await response.json();
// result.data.url را در فیلد img دوره ذخیره کنید
```

### دریافت لیست تصاویر کتاب‌ها:

```javascript
const response = await fetch("/api/admin/images?category=BOOK&limit=50");
const result = await response.json();
// result.data.items شامل لیست تصاویر کتاب‌ها است
```

## نکات مهم

1. ✅ همه درخواست‌ها نیاز به احراز هویت دارند (ADMIN)
2. ✅ فرمت‌های مجاز: JPG, PNG, GIF, WEBP, SVG
3. ✅ حداکثر حجم فایل: 10MB
4. ✅ تصاویر روی سرور محلی ذخیره می‌شوند در `public/uploads/images/`
5. ✅ URL تصاویر به صورت عمومی در دسترس هستند: `/uploads/images/{category}/{filename}`
6. ✅ حذف تصویر، فایل را از سرور و دیتابیس حذف می‌کند
7. ✅ دسته‌بندی به مدیریت بهتر تصاویر کمک می‌کند
8. ⚠️ دیگر نیازی به تنظیمات S3 Object Storage نیست
