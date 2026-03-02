"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Package, Mail, Lock, User, Phone, AlertCircle, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validation
    const newErrors: string[] = [];
    if (formData.password.length < 8) {
      newErrors.push("Пароль должен содержать минимум 8 символов");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Пароли не совпадают");
    }
    if (!formData.full_name.trim()) {
      newErrors.push("Укажите ваше имя");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    register({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone || undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">На главную</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-neutral-900">
              Sotoplace
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Регистрация
              </h1>
              <p className="text-neutral-600">
                Создайте аккаунт в Sotoplace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {(errors.length > 0 || error) && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg space-y-2">
                  {errors.map((err, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-error-600 flex-shrink-0" />
                      <p className="text-sm text-error-700">{err}</p>
                    </div>
                  ))}
                  {error && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-error-600 flex-shrink-0" />
                      <p className="text-sm text-error-700">
                        Ошибка регистрации. Попробуйте снова.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Полное имя *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="Иван Иванов"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Телефон
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Пароль *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Минимум 8 символов"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Подтвердите пароль *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Повторите пароль"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
                  required
                />
                <span className="text-sm text-neutral-600">
                  Я согласен с{" "}
                  <Link href="/terms" className="text-brand-600 hover:text-brand-700 underline">
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link href="/privacy" className="text-brand-600 hover:text-brand-700 underline">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isPending}
              >
                Зарегистрироваться
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Уже есть аккаунт?{" "}
                <Link
                  href="/login"
                  className="font-medium text-brand-600 hover:text-brand-700 transition-smooth"
                >
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
