"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Package, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
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
                Вход в систему
              </h1>
              <p className="text-neutral-600">
                Войдите в свой аккаунт Sotoplace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-error-600 flex-shrink-0" />
                  <p className="text-sm text-error-700">
                    Неверный email или пароль
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-neutral-600">
                    Запомнить меня
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-smooth"
                >
                  Забыли пароль?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isPending}
              >
                Войти
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Нет аккаунта?{" "}
                <Link
                  href="/register"
                  className="font-medium text-brand-600 hover:text-brand-700 transition-smooth"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Продолжая, вы соглашаетесь с{" "}
              <Link href="/terms" className="text-neutral-700 hover:text-neutral-900 underline">
                условиями использования
              </Link>{" "}
              и{" "}
              <Link href="/privacy" className="text-neutral-700 hover:text-neutral-900 underline">
                политикой конфиденциальности
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
