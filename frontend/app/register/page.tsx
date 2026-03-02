"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock, User, Phone, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-[#1f1f1f] mb-2">
            Регистрация
          </h1>
          <p className="text-[14px] text-[#737373]">
            Создайте аккаунт в Sotoplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(errors.length > 0 || error) && (
            <div className="p-3 bg-[#ffeeee] border border-[#e03636] rounded-lg space-y-1">
              {errors.map((err, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#e03636] flex-shrink-0" />
                  <p className="text-sm text-[#e03636]">{err}</p>
                </div>
              ))}
              {error && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#e03636] flex-shrink-0" />
                  <p className="text-sm text-[#e03636]">
                    Ошибка регистрации. Попробуйте снова.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Полное имя *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Иван Иванов"
                required
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Телефон
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Пароль *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Минимум 8 символов"
                required
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Подтвердите пароль *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Повторите пароль"
                required
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isPending}
          >
            {isPending ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#737373]">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="text-[#d18043] hover:text-[#a76636] font-medium transition-colors"
            >
              Войти
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
          <p className="text-xs text-center text-[#a3a3a3]">
            Регистрируясь, вы соглашаетесь с{" "}
            <Link href="/terms" className="underline hover:text-[#737373]">
              условиями использования
            </Link>{" "}
            и{" "}
            <Link href="/privacy" className="underline hover:text-[#737373]">
              политикой конфиденциальности
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
