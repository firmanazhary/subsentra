"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Lightbulb,
  PiggyBank,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/theme-context";
import { useI18n } from "@/context/i18n-context";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: t("nav.overview"), icon: LayoutDashboard, href: "/" },
    { name: t("nav.subscriptions"), icon: CreditCard, href: "/subscriptions" },
    { name: t("nav.savings"), icon: TrendingUp, href: "/savings" },
    { name: t("nav.insights"), icon: Lightbulb, href: "/insights" },
    { name: t("nav.investment"), icon: PiggyBank, href: "/investment" },
  ];

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Navbar (Visible on Mobile & Tablet < lg) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#111A14]/90 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-[#B8F27C]/15 p-1 shadow-xs">
            <Image
              src="/images/logo_subsentri.png"
              alt="SubSentra Logo"
              width={36}
              height={36}
              className="h-full w-full rounded-lg object-contain"
              priority
            />
          </div>

          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Sub<span className="text-[#3B871D] dark:text-[#B8F27C]">Sentra</span>
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-gray-700 shadow-xs transition hover:bg-black/5 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Desktop fixed + Mobile slide-over drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-black/10 bg-white p-5 transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-[#111A14] lg:translate-x-0 ${
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo and close button for mobile */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#B8F27C]/15 p-1 shadow-sm transition group-hover:scale-105">
              <Image
                src="/images/logo_subsentri.png"
                alt="SubSentra Logo"
                width={40}
                height={40}
                className="h-full w-full rounded-lg object-contain"
                priority
              />
            </div>

            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Sub<span className="text-[#3B871D] dark:text-[#B8F27C]">Sentra</span>
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {t("nav.workspace")}
        </p>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-[#B8F27C] font-semibold text-[#142018] shadow-sm"
                    : "text-gray-600 hover:bg-black/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls: Theme Switcher + Settings */}
        <div className="space-y-1.5 border-t border-black/10 pt-4 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-black/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Sun size={19} className="text-[#B8F27C]" />
              ) : (
                <Moon size={19} className="text-gray-700" />
              )}
              <span>{theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}</span>
            </div>
            <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600 dark:bg-white/10 dark:text-gray-300">
              {theme}
            </span>
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-black/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
            <Settings size={19} />
            {t("nav.settings")}
          </button>
        </div>
      </aside>
    </>
  );
}
