# نظام إدارة الإعلانات - Arab Film DB

## نظرة عامة
تم إضافة نظام كامل لإدارة الإعلانات في الموقع، يسمح للأدمن بإضافة وإدارة الإعلانات (صور أو فيديوهات) التي تظهر في الصفحة الرئيسية.

## الملفات المضافة

### 1. `src/api/advertisementsService.js`
Service شامل لإدارة جميع عمليات API الخاصة بالإعلانات:
- `createAdvertisement(formData)` - إنشاء إعلان جديد
- `getAllAdvertisements()` - جلب جميع الإعلانات (admin)
- `getActiveAdvertisements()` - جلب الإعلانات النشطة (public)
- `getAdvertisementById(id)` - جلب إعلان محدد
- `updateAdvertisement(id, formData)` - تحديث إعلان
- `toggleAdvertisement(id)` - تفعيل/إلغاء تفعيل إعلان
- `deleteAdvertisement(id)` - حذف إعلان

### 2. `src/componet/AdvertisementSlider.jsx`
مكون عرض الإعلانات في الصفحة الرئيسية:
- يعرض الإعلانات النشطة فقط
- يدعم الصور والفيديوهات
- Auto-play carousel مع تأثيرات انتقالية
- Responsive design
- معالجة حالات التحميل والأخطاء

## التعديلات على الملفات الموجودة

### 1. `src/Pages/Home.jsx`
- إضافة import للـ `AdvertisementSlider`
- عرض المكون تحت الـ Navbar مباشرة

### 2. `src/Dashboard/AdminDashboard.jsx`
تمت إضافة قسم كامل لإدارة الإعلانات يشمل:

#### في Sidebar:
- عنصر قائمة جديد "الإعلانات" في قسم الأدوات
- أيقونة FiImage للتمييز البصري

#### في المحتوى الرئيسي:
- **نموذج إضافة/تعديل إعلان**:
  - اسم الإعلان
  - نوع الوسائط (صورة/فيديو)
  - رفع الملف
  - Modal منبثق مع تصميم احترافي

- **جدول عرض الإعلانات**:
  - عرض جميع الإعلانات مع المعلومات الكاملة
  - معاينة صغيرة للصورة/الفيديو
  - حالة الإعلان (نشط/معطل)
  - أزرار التحكم: تفعيل/إلغاء تفعيل، تعديل، حذف

#### State Management:
```javascript
const [advertisements, setAdvertisements] = useState([]);
const [advertisementsLoading, setAdvertisementsLoading] = useState(false);
const [showAdForm, setShowAdForm] = useState(false);
const [editingAd, setEditingAd] = useState(null);
```

#### Functions:
- `fetchAdvertisements()` - جلب الإعلانات
- `handleDeleteAdvertisement(id)` - حذف إعلان
- `handleToggleAdvertisement(id)` - تفعيل/إلغاء تفعيل
- `handleAdFormSubmit(e)` - إضافة/تحديث إعلان

## هيكل البيانات

### عند الإنشاء (POST):
```javascript
{
  name: "اسم الإعلان",
  mediaType: "image", // أو "video"
  media: File // ملف الصورة أو الفيديو
}
```

### البيانات المستلمة من API:
```javascript
{
  _id: "advertisement-id",
  name: "اسم الإعلان",
  mediaType: "image",
  media: "/uploads/advertisements/filename.jpg",
  isActive: true,
  createdAt: "2025-12-04T10:00:00.000Z",
  updatedAt: "2025-12-04T10:00:00.000Z"
}
```

## API Endpoints

```
POST   /api/advertisements           - إنشاء إعلان (admin, multipart/form-data)
GET    /api/advertisements           - جلب جميع الإعلانات (admin)
GET    /api/advertisements/active    - جلب الإعلانات النشطة (public)
GET    /api/advertisements/:id       - جلب إعلان محدد (admin)
PATCH  /api/advertisements/:id       - تحديث إعلان (admin)
PATCH  /api/advertisements/:id/toggle - تفعيل/إلغاء تفعيل (admin)
DELETE /api/advertisements/:id       - حذف إعلان (admin)
```

## الميزات الرئيسية

### للمستخدمين العاديين:
✅ عرض الإعلانات النشطة فقط في الصفحة الرئيسية
✅ تشغيل تلقائي للإعلانات (Auto-play)
✅ تصميم متجاوب يعمل على جميع الأجهزة
✅ دعم الصور والفيديوهات
✅ تأثيرات انتقالية احترافية

### للأدمن:
✅ إضافة إعلانات جديدة (صور أو فيديو)
✅ تعديل الإعلانات الموجودة
✅ تفعيل/إلغاء تفعيل الإعلانات
✅ حذف الإعلانات
✅ معاينة الإعلانات في الجدول
✅ واجهة مستخدم احترافية وسهلة

## التصميم والـ UX

- **Modal Form**: نموذج منبثق مع خلفية معتمة وتأثير blur
- **Responsive**: يعمل بشكل مثالي على جميع أحجام الشاشات
- **Loading States**: مؤشرات تحميل واضحة
- **Error Handling**: معالجة الأخطاء مع رسائل toast
- **Preview**: معاينة فورية للوسائط في الجدول
- **Status Badges**: شارات ملونة توضح حالة كل إعلان
- **Action Buttons**: أزرار واضحة مع ألوان دلالية

## استخدام النظام

### للأدمن - إضافة إعلان جديد:
1. انتقل إلى لوحة التحكم (AdminDashboard)
2. اختر "الإعلانات" من القائمة الجانبية
3. اضغط على زر "+ إضافة إعلان جديد"
4. املأ البيانات:
   - اسم الإعلان
   - نوع الوسائط (صورة أو فيديو)
   - اختر الملف
5. اضغط "إضافة"

### تفعيل/إلغاء تفعيل:
- في جدول الإعلانات، اضغط على زر "تفعيل" أو "إلغاء التفعيل"
- فقط الإعلانات النشطة تظهر في الصفحة الرئيسية

### التعديل:
- اضغط على زر "تعديل" بجانب الإعلان
- عدّل البيانات المطلوبة
- يمكنك تحديث الصورة/الفيديو أو الإبقاء على القديمة

### الحذف:
- اضغط على زر "حذف"
- أكّد عملية الحذف

## الاعتبارات الأمنية

- جميع عمليات الإدارة محمية وتتطلب صلاحيات admin
- التحقق من صلاحية الملفات (صور/فيديوهات فقط)
- استخدام FormData لرفع الملفات بشكل آمن
- Token authentication عبر axiosInstance

## التحسينات المستقبلية المقترحة

- إضافة ترتيب للإعلانات (drag & drop)
- إضافة جدولة زمنية للإعلانات
- إحصائيات عن مشاهدات الإعلانات
- رفع أكثر من ملف واحد (معرض للإعلان الواحد)
- إضافة روابط للإعلانات (CTA buttons)
- دعم الإعلانات النصية
