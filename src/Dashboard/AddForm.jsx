import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService } from '../api/workService';
import { uploadService } from '../api/uploadService';
import { SiNetflix, SiYoutube } from 'react-icons/si';
import { FaPlay } from 'react-icons/fa';

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
    directorImageUrl: '',
    assistantDirector: '',
    assistantDirectorImageUrl: '',
    genre: '',
    // cast is array of objects { name, imageUrl }
    actors: [{ name: '', imageUrl: '' }],
    country: '',
    location: '',
    summary: '',
    posterUrl: '',
    seasons: '',
    episodes: '',
    // platforms: array of { name, url }
    platforms: [],
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
              directorImageUrl: work.directorImage?.url || '',
              assistantDirector: work.assistantDirector || '',
              assistantDirectorImageUrl: work.assistantDirectorImage?.url || '',
              genre: work.genre || '',
              actors: work.cast && work.cast.length > 0 ? work.cast.map(a => ({ name: a.name || a, imageUrl: a.image?.url || a.image || '' })) : [{ name: '', imageUrl: '' }],
              country: work.country || '',
              location: work.filmingLocation || '',
              summary: work.summary || '',
              posterUrl: work.posterUrl || '',
              seasons: work.seasonsCount || '',
              episodes: work.episodesCount || '',
              platforms: work.platforms || []
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
      updatedActors[index] = { ...updatedActors[index], name: value };
      setFormData({ ...formData, actors: updatedActors });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleActorImageChange = async (file, index) => {
    if (!file) return;
    try {
      const res = await uploadService.uploadImage(file);
      // res.data contains public_id and secure_url depending on backend
      const url = res.secure_url || res.url || res.secureUrl || res.data?.secure_url || res.secureUrl;
      const updatedActors = [...formData.actors];
      updatedActors[index] = { ...updatedActors[index], imageUrl: url };
      setFormData({ ...formData, actors: updatedActors });
    } catch (err) {
      console.error('Failed to upload actor image', err);
      alert('فشل رفع صورة الممثل');
    }
  };

  const handleDirectorImageChange = async (file) => {
    if (!file) return;
    try {
      const res = await uploadService.uploadImage(file);
      const url = res.secure_url || res.url || res.secureUrl || res.data?.secure_url || res.secureUrl;
      setFormData({ ...formData, directorImageUrl: url });
    } catch (err) {
      console.error('Failed to upload director image', err);
      alert('فشل رفع صورة المخرج');
    }
  };

  const handleAssistantDirectorImageChange = async (file) => {
    if (!file) return;
    try {
      const res = await uploadService.uploadImage(file);
      const url = res.secure_url || res.url || res.secureUrl || res.data?.secure_url || res.secureUrl;
      setFormData({ ...formData, assistantDirectorImageUrl: url });
    } catch (err) {
      console.error('Failed to upload assistant director image', err);
      alert('فشل رفع صورة مساعد المخرج');
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
    setFormData({ ...formData, actors: [...formData.actors, { name: '', imageUrl: '' }] });
  };

  const removeActor = (index) => {
    if (formData.actors.length > 1) {
      const updatedActors = formData.actors.filter((_, i) => i !== index);
      setFormData({ ...formData, actors: updatedActors });
    }
  };

  const addPlatform = () => {
    setFormData({ ...formData, platforms: [...formData.platforms, { name: 'netflix', url: '' }] });
  };

  const removePlatform = (index) => {
    const updated = formData.platforms.filter((_, i) => i !== index);
    setFormData({ ...formData, platforms: updated });
  };

  const handlePlatformChange = (index, key, value) => {
    const updated = [...formData.platforms];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, platforms: updated });
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
      directorImage: formData.directorImageUrl ? { url: formData.directorImageUrl } : undefined,
      assistantDirector: formData.assistantDirector.trim(),
      assistantDirectorImage: formData.assistantDirectorImageUrl ? { url: formData.assistantDirectorImageUrl } : undefined,
      genre: formData.genre.trim(),
      // cast as array of objects { name, image: { url } }
      cast: formData.actors
        .filter(actor => actor && actor.name && actor.name.trim() !== '')
        .map(a => ({ name: a.name.trim(), image: a.imageUrl ? { url: a.imageUrl } : undefined })),
      country: formData.country.trim(),
      filmingLocation: formData.location.trim(),
      summary: formData.summary.trim(),
      posterUrl: formData.posterUrl.trim()
    };

    // attach platforms if any
    if (formData.platforms && Array.isArray(formData.platforms) && formData.platforms.length > 0) {
      cleanedData.platforms = formData.platforms
        .map(p => (p && p.name && p.url) ? { name: p.name, url: p.url } : null)
        .filter(Boolean);
    }

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
          if (cleanedData.directorImage) fd.append('directorImage', JSON.stringify(cleanedData.directorImage));
          if (cleanedData.assistantDirectorImage) fd.append('assistantDirectorImage', JSON.stringify(cleanedData.assistantDirectorImage));
          if (cleanedData.platforms) fd.append('platforms', JSON.stringify(cleanedData.platforms));
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
              type: 'فيلم', arabicName: '', englishName: '', year: '', director: '', directorImageUrl: '', assistantDirector: '', assistantDirectorImageUrl: '', genre: '', actors: [{ name: '', imageUrl: '' }], country: '', location: '', summary: '', posterUrl: '', seasons: '', episodes: '', platforms: []
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
            directorImageUrl: '',
            assistantDirector: '',
            assistantDirectorImageUrl: '',
            genre: '',
            actors: [{ name: '', imageUrl: '' }],
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
      setFormData({
        type: 'فيلم',
        arabicName: '',
        englishName: '',
        year: '',
        director: '',
        directorImageUrl: '',
        assistantDirector: '',
        assistantDirectorImageUrl: '',
        genre: '',
        actors: [{ name: '', imageUrl: '' }],
        country: '',
        location: '',
        summary: '',
        posterUrl: '',
        seasons: '',
        episodes: '',
        platforms: []
      });
      const errMsg = error?.response?.data?.message || error.message || 'حدث خطأ أثناء حفظ العمل';
      alert(errMsg);
    }
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
          <div className="mt-2">
            <label className="block mb-1">صورة المخرج (اختياري)</label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; handleDirectorImageChange(f); }} />
            {formData.directorImageUrl && (
              <div className="mt-2">
                <img src={formData.directorImageUrl} alt="director" className="max-h-28 rounded" />
              </div>
            )}
          </div>
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
          <div className="mt-2">
            <label className="block mb-1">صورة مساعد المخرج (اختياري)</label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; handleAssistantDirectorImageChange(f); }} />
            {formData.assistantDirectorImageUrl && (
              <div className="mt-2">
                <img src={formData.assistantDirectorImageUrl} alt="assistant-director" className="max-h-28 rounded" />
              </div>
            )}
          </div>
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
            <div key={index} className="flex flex-col gap-2 mb-2 bg-gray-900/30 p-3 rounded">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="actors"
                  value={actor.name}
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
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-black font-semibold rounded-lg cursor-pointer hover:bg-amber-500 transition">
                  <span className="text-sm">صورة الممثل</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleActorImageChange(f, index); }}
                    className="hidden"
                  />
                </label>
                {actor.imageUrl ? (
                  <img src={actor.imageUrl} alt={`actor-${index}`} className="max-h-20 rounded" />
                ) : (
                  <span className="text-xs text-gray-400">لم يتم رفع صورة بعد</span>
                )}
              </div>
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

        <div>
          <label className="block mb-1">المنصات (اختر المنصة وأضف رابط العمل)</label>
          {formData.platforms && formData.platforms.length > 0 ? (
            formData.platforms.map((p, idx) => {
              const name = (p.name || '').toLowerCase();
              let Icon = null;
              if (name === 'netflix') Icon = SiNetflix;
              else if (name === 'youtube') Icon = SiYoutube;
              else Icon = FaPlay;

              return (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                      <img src={(p.name || '').toLowerCase() === 'ocn' || (p.name || '').toLowerCase() === 'osn' ? '/assets/platforms/ocn.svg' : `/assets/platforms/${(p.name||'').toLowerCase()}.svg`} alt={p.name} className="w-10 h-10 object-contain" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.style.display='none'}} />
                      <select value={p.name} onChange={(e) => handlePlatformChange(idx, 'name', e.target.value)} className="p-2 rounded bg-gray-700">
                    <option value="netflix">Netflix</option>
                    <option value="shahid">Shahid</option>
                    <option value="youtube">YouTube</option>
                    <option value="ocn">OCN</option>
                  </select>
                  <input type="url" value={p.url} onChange={(e) => handlePlatformChange(idx, 'url', e.target.value)} placeholder="رابط العمل على المنصة" className="flex-1 p-2 rounded bg-gray-700" />
                  <button type="button" onClick={() => removePlatform(idx)} className="px-3 py-2 bg-red-600 rounded">حذف</button>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-400 mb-2">لم تقم بإضافة أي منصة بعد.</p>
          )}
          <button type="button" onClick={addPlatform} className="text-sm text-amber-300 hover:underline mb-4">+ أضف منصة</button>
        </div>

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
