"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-[#1f1f1f] mb-2">
            Вход в систему
          </h1>
          <p className="text-[14px] text-[#737373]">
            Войдите в свой аккаунт Sotoplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#ffeeee] border border-[#e03636] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#e03636]" />
              <p className="text-sm text-[#e03636]">
                Неверный email или пароль
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-12 pl-10 pr-4 border border-[#d4d4d4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d18043] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[#d4d4d4] text-[#d18043] focus:ring-[#d18043]"
              />
              <span className="text-[#737373]">Запомнить меня</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#d18043] hover:text-[#a76636] transition-colors"
            >
              Забыли пароль?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isPending}
          >
            {isPending ? "Вход..." : "Войти"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#737373]">
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="text-[#d18043] hover:text-[#a76636] font-medium transition-colors"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
          <p className="text-xs text-center text-[#a3a3a3]">
            Продолжая, вы соглашаетесь с{" "}
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
