/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../api/axiosInstance";
import { da } from "zod/locales";
import { fa } from "zod/v4/locales";
function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [signupError, setSignupError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const schema = z.object({

        password: z.string().min(10, "كلمة المرور يجب أن تكون أكثر من 10 أحرف").max(20, 'كلمة المرور يجب أن تكون أقل من 20 حرف'),
        confirmPassword: z.string().min(10, "كلمة المرور يجب أن تكون أكثر من 10 أحرف").max(20, 'كلمة المرور يجب أن تكون أقل من 20 حرف'),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "كلمتا المرور غير متطابقتين",
        path: ["confirmPassword"],
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });


    const onSubmit = async (data) => {
        console.log("Form data:", data);
        setLoading(true);

        try {
            console.log(token);

            const response = await axiosInstance.post(`users/reset-password/${token}`, {
                newPassword: data.password,
            });
            console.log('Registration success:', response.data);
            setLoading(false);
            navigate('/Login');

        } catch (errors) {
            console.error('Registration error:', errors.response?.data || errors.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  text-foreground ">
            <div style={{ backgroundColor: "black" }} className="min-h-screen flex  justify-center bg-background py-35 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-4 text-4xl font-bold text-white">أعاده تعيين كلمه المرور</h2>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-1">
                        <div className="space-y-3">

                            <div>
                                <label htmlFor="password" className="block text-lg font-medium text-foreground mb-2 text-white">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        id="password"
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
                            {errors.password && <p className="text-red-500 text-sm mt-5">{errors.password.message}</p>}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-lg font-medium text-foreground mb-2 text-white">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <input type="password" {...register("confirmPassword")} id="confirmPassword" required className="w-full px-4 py-3 pr-12 bg-input border border-none  rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-white" placeholder="أدخل تأكيد كلمة المرور" dir="rtl" style={{ backgroundColor: '#262626' }} />
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
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                import ResetPassword
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-5">{errors.confirmPassword.message}</p>}

                            {signupError && <p>{signupError}</p>}
                            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-bold rounded-lg text-white  hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" style={{ backgroundColor: 'var(--color-accent)' }}>
                                {loading ? "جاري التسجيل..." : " تسجيل الدخول"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default ResetPassword;