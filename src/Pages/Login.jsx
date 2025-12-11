import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { axiosInstance } from "../api/axiosInstance";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userData';
function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [showReset, setShowReset] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    dispatch(setUser(JSON.parse(storedUser)));
                }
                }, []);
    const onSubmit = async (data) => {
        console.log(data);

        try {
            const response = await axiosInstance.post('/users/signin', {
                "email": data.email,
                "password": data.password,
            });
            console.log('Registration data:', data);
            console.log('Registration success:', response.data);
            setLoading(true);
            console.log(data);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            dispatch(setUser(response.data.user));
            
            // Redirect based on role
            if (response.data.user.role === 'admin' || response.data.user.role === 'publisher') {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (errors) {
  let serverMsg = errors.response?.data?.message;

  if (serverMsg === "Invalid credentials") {
    serverMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  }

  setLoginError(serverMsg || "حدث خطأ أثناء تسجيل الدخول");
} finally {
            setLoading(false);
        }
    };

    
    const sendToEmail = async (email) => {
  if (!email) {
    setLoginError("يرجى إدخال البريد الإلكتروني");
    return;
  }

  setLoading(true); // خليها في الأول عشان تمنع التكرار
  try {
    const response = await axiosInstance.post('/users/forgot-password', {
      email: email,
    });

    console.log('API response:', response.data);    
    // const token = response.data?.token;
    // if (token) {
    //   window.location.href = `/reset-password/${token}`;
    // } else {
    //   console.warn("لم يتم استلام رمز التحقق");
    // }
    alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    setShowReset(false); // إغلاق النافذة بعد الإرسال
  } catch (error) {
    const message = error.response?.data?.message || "حدث خطأ أثناء إرسال البريد";
    setLoginError(message);
    console.error("Error in sendToEmail:", message);
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="min-h-screen text-foreground">
            <div style={{ backgroundColor: "black" }} className="min-h-screen flex justify-center bg-background py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-log-in mx-auto  h-20 w-18 text-amber-300"
                            aria-hidden="true"
                        >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" x2="3" y1="12" y2="12" />
                        </svg>

                        <h2 className="mt-4 text-4xl font-bold text-white">تسجيل الدخول</h2>
                        <p className="mt-2 text-md text-white">
                            أو <span className="font-bold text-yellow-500 hover:text-yellow-600 transition-colors cursor-pointer" onClick={() => navigate("/Register")}>  إنشاء حساب جديد</span>
                        </p>
                    </div>
                    {loginError && (
                        <div className="bg-red-600 text-white px-4 py-3 rounded-md text-center font-bold text-md">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-1">
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-white mb-2">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        required
                                        className="w-full px-4 py-3 pr-12 bg-input border border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
                                        placeholder="أدخل بريدك الإلكتروني"
                                        dir="rtl"
                                        style={{ backgroundColor: '#262626' }}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-mail absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                                        aria-hidden="true"
                                    >
                                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-lg font-medium text-white mb-2">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"

                                        {...register("password")}
                                        required
                                        className="w-full px-4 py-3 pr-12 bg-input border border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-white"
                                        placeholder="أدخل كلمة المرور"
                                        dir="rtl"
                                        style={{ backgroundColor: '#262626' }}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-lock absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                                        aria-hidden="true"
                                    >
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="lucide lucide-eye-off"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M17.94 17.94A10.93 10.93 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.06-2.81 2.9-5.19 5.26-6.67" />
                                                <path d="M1 1l22 22" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="lucide lucide-eye"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M2.062 12.348a1 1 0 0 1 0-.696A10.75 10.75 0 0 1 21.938 12.348a1 1 0 0 1 0 .696A10.75 10.75 0 0 1 2.062 12.348z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between my-5">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                                        type="checkbox"
                                        name="remember-me"
                                    />
                                    <label htmlFor="remember-me" className="mr-2 block text-md text-white">
                                        تذكرني
                                    </label>
                                </div>
                                <div className="text-md">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowReset(true);
                                        }}
                                        className="font-medium text-amber-300 hover:text-primary/80 transition-colors"
                                    >
                                        نسيت كلمة المرور؟
                                    </a>
                                    {showReset && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                            <div className="bg-[#101829] rounded-lg shadow-lg w-full max-w-md p-6">
                                                <h2 className="text-2xl font-bold mb-4 text-center text-white">إعادة تعيين كلمة المرور</h2>
                                                <form onSubmit={(e) => e.preventDefault()}>

                                                    <input
                                                        type="email"
                                                        id="repass"
                                                        required
                                                        placeholder="أدخل بريدك الإلكتروني"
                                                        className="w-full p-3 rounded bg-gray-700 border border-gray-500 text-white mb-4"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            
                                                            onClick={() => {
                                                                if (!loading) sendToEmail(repass.value); // أو repassRef.current.value
                                                            }}
                                                            disabled={loading}
                                                            className="flex-1 bg-amber-300 hover:bg-amber-600 text-white font-bold py-2 rounded"
                                                            >
                                                            {loading ? "جاري الإرسال..." : "إرسال"}
                                                            </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowReset(false)}
                                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded"
                                                        >
                                                            إلغاء
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-bold rounded-lg text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                style={{ backgroundColor: 'var(--color-accent)' }}
                            >
                                {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <a className="text-md text-gray-400 hover:text-white transition-colors" href="/" data-discover="true">العودة إلى الصفحة الرئيسية</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
