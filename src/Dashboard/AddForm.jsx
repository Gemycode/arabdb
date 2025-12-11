import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService } from '../api/workService';

export default function FilmForm() {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { id } = useParams(); // يجيب id من الرابط لو في وضع التعديل
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in on site with proper role, skip this mini-login
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (user && token && (user.role === 'admin' || user.role === 'publisher')) {
        setIsVerified(true);
        return;
      }
    } catch (_) { }
    const verified = sessionStorage.getItem("dashboardVerified");
    if (verified === "true") {
      setIsVerified(true);
    }
  }, []);

  const API_URL = "https://arabfilmsserver.onrender.com/api/users/signin";

  const handleSubmitt = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let errorData = {};
      if (!response.ok) {
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text();
          errorData.message = text || 'فشل تسجيل الدخول (خطأ غير متوقع)';
        }
        throw new Error(errorData.message || 'فشل تسجيل الدخول');
      }

      // Success: parse the response
      const data = await response.json();
      // Store token if needed
      if (data.token) {
        sessionStorage.setItem('dashboardToken', data.token);
      }
      sessionStorage.setItem("dashboardVerified", "true");
      setIsVerified(true);
    } catch (error) {
      alert(error.message || "الإيميل أو كلمة المرور غير صحيحة");
    }
  };

  const [formData, setFormData] = useState({
    type: 'فيلم',
    arabicName: '',
    englishName: '',
    year: '',
    director: '',
    assistantDirector: '',
    genre: '',
    actors: [''],
    country: '',
    location: '',
    summary: '',
    posterUrl: '',
    seasons: '',
    episodes: ''
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (id && id !== 'undefined') {
      setLoading(true);
      workService.getWorkById(id)
        .then(work => {
          if (work) {
            setFormData({
              type: work.type === 'film' ? 'فيلم' : 'مسلسل',
              arabicName: work.nameArabic || '',
              englishName: work.nameEnglish || '',
              year: work.year || '',
              director: work.director || '',
              assistantDirector: work.assistantDirector || '',
              genre: work.genre || '',
              actors: work.cast && work.cast.length > 0 ? work.cast : [''],
              country: work.country || '',
              location: work.filmingLocation || '',
              summary: work.summary || '',
              posterUrl: work.posterUrl || '',
              seasons: work.seasonsCount || '',
              episodes: work.episodesCount || ''
            });
            // set preview if posterUrl exists
            setImagePreview(work.posterUrl || '');
          } else {
            alert('لم يتم العثور على العمل المطلوب تعديله');
            navigate('/dashboard');
          }
        })
        .catch(error => {
          console.error('Error loading work:', error);
          alert('حدث خطأ أثناء تحميل بيانات العمل');
          navigate('/dashboard');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'actors' && index !== null) {
      const updatedActors = [...formData.actors];
      updatedActors[index] = value;
      setFormData({ ...formData, actors: updatedActors });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedImageFile(null);
      setImagePreview('');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('صيغة الملف غير مدعومة. استخدم JPG أو PNG أو GIF أو WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
      return;
    }

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addActor = () => {
    setFormData({ ...formData, actors: [...formData.actors, ''] });
  };

  const removeActor = (index) => {
    if (formData.actors.length > 1) {
      const updatedActors = formData.actors.filter((_, i) => i !== index);
      setFormData({ ...formData, actors: updatedActors });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تنظيف البيانات قبل الإرسال
    const cleanedData = {
      type: formData.type === 'فيلم' ? 'film' : 'series',
      nameArabic: formData.arabicName.trim(),
      nameEnglish: formData.englishName.trim(),
      year: parseInt(formData.year) || 2000,
      director: formData.director.trim(),
      assistantDirector: formData.assistantDirector.trim(),
      genre: formData.genre.trim(),
      cast: formData.actors.filter(actor => actor.trim() !== ''),
      country: formData.country.trim(),
      filmingLocation: formData.location.trim(),
      summary: formData.summary.trim(),
      posterUrl: formData.posterUrl.trim()
    };

    // إضافة حقول المسلسل إذا كان نوع العمل مسلسل
    if (formData.type === 'مسلسل') {
      cleanedData.seasonsCount = parseInt(formData.seasons) || 1;
      cleanedData.episodesCount = parseInt(formData.episodes) || 1;
    }

    try {
      // If there's a selected file, send multipart/form-data including the file
      if (selectedImageFile) {
        const fd = new FormData();
        // append fields
        fd.append('type', cleanedData.type);
        fd.append('nameArabic', cleanedData.nameArabic);
        fd.append('nameEnglish', cleanedData.nameEnglish);
        fd.append('year', cleanedData.year);
        fd.append('director', cleanedData.director);
        fd.append('assistantDirector', cleanedData.assistantDirector);
        fd.append('genre', cleanedData.genre);
        fd.append('cast', JSON.stringify(cleanedData.cast));
        fd.append('country', cleanedData.country);
        fd.append('filmingLocation', cleanedData.filmingLocation);
        fd.append('summary', cleanedData.summary);
        // seasons/episodes if series
        if (cleanedData.seasonsCount) fd.append('seasonsCount', cleanedData.seasonsCount);
        if (cleanedData.episodesCount) fd.append('episodesCount', cleanedData.episodesCount);
        // Append file under field name 'image' (backend expects this)
        fd.append('image', selectedImageFile);

        if (id && id !== 'undefined') {
          await workService.updateWorkWithImage(id, fd);
          alert('تم تعديل العمل بنجاح');
          navigate('/dashboard');
        } else {
          await workService.createWorkWithImage(fd);
          alert('تم إضافة العمل بنجاح');
          // reset form
          setFormData({
            type: 'فيلم', arabicName: '', englishName: '', year: '', director: '', assistantDirector: '', genre: '', actors: [''], country: '', location: '', summary: '', posterUrl: '', seasons: '', episodes: ''
          });
          setSelectedImageFile(null);
          setImagePreview('');
        }
      } else {
        if (id && id !== 'undefined') {
          await workService.updateWork(id, cleanedData);
          alert('تم تعديل العمل بنجاح');
          navigate('/dashboard');
        } else {
          await workService.createWork(cleanedData, false);
          alert('تم إضافة العمل بنجاح');
          // Reset form only for new work
          setFormData({
            type: 'فيلم',
            arabicName: '',
            englishName: '',
            year: '',
            director: '',
            assistantDirector: '',
            genre: '',
            actors: [''],
            country: '',
            location: '',
            summary: '',
            posterUrl: '',
            seasons: '',
            episodes: ''
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'حدث خطأ أثناء حفظ العمل';
      alert(errorMessage);
    }
  };

  if (loading) return <p className="text-white">جاري التحميل...</p>;

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Navbar and Footer hidden on login screen */}
        <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <form onSubmit={handleSubmitt} className="space-y-6 bg-gray-900/50 p-6 rounded-lg">

              <input
                type="email"
                placeholder="الإيميل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
              />

              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
              />

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500"
              >
                دخول
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard: hide Navbar and Footer
  return (
    <div className="bg-black py-20 min-h-screen">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          {id && (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              ← العودة للوحة التحكم
            </button>
          )}
          <h1 className="text-3xl font-bold text-white text-center flex-1">
            {id ? 'تعديل العمل' : 'إضافة عمل جديد'}
          </h1>
          {id && (
            <button
              onClick={() => navigate('/AddForm')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              + إضافة عمل جديد
            </button>
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg space-y-6"
      >
        <div>
          <label className="block mb-1">نوع العمل *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="فيلم">فيلم</option>
            <option value="مسلسل">مسلسل</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">الاسم بالعربية *</label>
          <input
            type="text"
            name="arabicName"
            value={formData.arabicName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">الاسم بالإنجليزية *</label>
          <input
            type="text"
            name="englishName"
            value={formData.englishName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">السنة *</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1800"
            max="3000"
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">المخرج *</label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">مساعد المخرج *</label>
          <input
            type="text"
            name="assistantDirector"
            value={formData.assistantDirector}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">النوع *</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">الأبطال *</label>
          {formData.actors.map((actor, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                name="actors"
                value={actor}
                onChange={(e) => handleChange(e, index)}
                required
                className="flex-1 p-2 rounded bg-gray-700"
                placeholder={`الممثل ${index + 1}`}
              />
              {formData.actors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActor(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  حذف
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addActor}
            className="text-sm text-amber-300 hover:underline"
          >
            + أضف بطل آخر
          </button>
        </div>

        <div>
          <label className="block mb-1">الدولة *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">موقع التصوير *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">الملخص *</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="4"
            required
            className="w-full p-2 rounded bg-gray-700"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1">رابط البوستر (أو ارفع صورة)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              required={!selectedImageFile}
              className="w-full p-2 rounded bg-gray-700"
              placeholder="https://example.com/image.jpg"
            />
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-semibold rounded-lg cursor-pointer hover:bg-amber-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h4a1 1 0 110 2H5v10h10v-3a1 1 0 112 0v4a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" clipRule="evenodd" />
                  <path d="M9 7a1 1 0 012 0v4.586l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586V7z" />
                </svg>
                <span>اختر صورة من الجهاز</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="mt-2 text-center">
                    <img src={imagePreview} alt="preview" className="max-h-40 rounded-md mx-auto" />
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <button type="button" onClick={() => { setSelectedImageFile(null); setImagePreview(''); }} className="px-3 py-1 bg-red-600 rounded text-white text-sm">إزالة الصورة</button>
                      <button type="button" onClick={() => { navigator.clipboard?.writeText(formData.posterUrl || '') }} className="px-3 py-1 bg-gray-700 rounded text-white text-sm">نسخ رابط (إن وُجد)</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">اختر ملف صورة لرفعها مباشرة مع النموذج (اختياري).</p>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-yellow-400 mt-1">
            ⚠️ يمكنك إدخال رابط مباشر للصورة أو اختيار رفع ملف من الجهاز. الحقل ليس مطلوبًا إذا رفعت صورة.
            يمكنك رفع الصورة عبر الفورم أو استخدام مواقع استضافة مثل <a href="https://imgbb.com/" target="_blank" className="underline">ImgBB</a> أو
            <a href="https://imgur.com/" target="_blank" className="underline ml-1">Imgur</a>
          </p>
        </div>

        {formData.type === 'مسلسل' && (
          <>
            <div>
              <label className="block mb-1">عدد المواسم *</label>
              <input
                type="number"
                name="seasons"
                value={formData.seasons}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>

            <div>
              <label className="block mb-1">عدد الحلقات *</label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-amber-300 text-black font-bold px-6 py-2 rounded hover:bg-amber-400 transition"
        >
          {id ? 'تعديل العمل' : 'إضافة عمل جديد'}
        </button>
      </form>
    </div>
  );
}
