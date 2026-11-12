"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Home,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Lightbulb,
  Radio,
} from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  const quickLinks = [
    {
      href: "/",
      title: "Overview Dashboard",
      desc: "Live metrics & spending",
      icon: Home,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      href: "/subscriptions",
      title: "350+ Subscriptions",
      desc: "US, JP, ID pricing catalog",
      icon: CreditCard,
      color: "text-lime-500 bg-lime-500/10",
    },
    {
      href: "/savings",
      title: "Savings Simulator",
      desc: "Simulate cutting bills",
      icon: PiggyBank,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      href: "/insights",
      title: "Smart Insights",
      desc: "Overlapping services alert",
      icon: Lightbulb,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      href: "/investment",
      title: "Investment Growth",
      desc: "Compound interest simulator",
      icon: TrendingUp,
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between bg-[#F4F6F4] text-gray-900 transition-colors duration-200 dark:bg-[#101713] dark:text-white p-5 sm:p-8 lg:p-12 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[450px] w-[450px] sm:h-[650px] sm:w-[650px] rounded-full bg-gradient-to-tr from-[#2F7317]/15 via-[#B8F27C]/10 to-transparent blur-3xl" />
      </div>

      {/* Top Navbar: Brand logo */}
      <header className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#B8F27C]/15 p-1 shadow-xs transition group-hover:scale-105">
            <Image
              src="/images/logo_subsentri.png"
              alt="SubSentra Logo"
              width={40}
              height={40}
              className="h-full w-full rounded-lg object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sub<span className="text-[#3B871D] dark:text-[#B8F27C]">Sentra</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs backdrop-blur-xs transition hover:bg-white dark:border-white/10 dark:bg-[#1B2720]/80 dark:text-gray-300 dark:hover:bg-[#1B2720]"
        >
          <Home size={14} />
          <span>Dashboard</span>
        </Link>
      </header>

      {/* Center 404 Hero */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center text-center">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 shadow-2xs">
          <Radio size={14} className="animate-pulse" />
          <span>404_ROUTE_UNSUBSCRIBED · ROUTE NOT FOUND</span>
        </div>

        {/* Giant Stylized 404 Visual with Compass Icon */}
        <div className="relative mt-5 flex items-center justify-center">
          {/* Giant 404 Text */}
          <div className="text-8xl sm:text-9xl md:text-[13rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#2F7317] via-[#3B871D] to-[#B8F27C] select-none leading-none">
            404
          </div>

          {/* Floating Compass Pill */}
          <div className="absolute -bottom-2 sm:-bottom-3 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-black/10 bg-white text-[#2F7317] shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#1B2720] dark:text-[#B8F27C] animate-bounce">
            <Compass size={24} className="sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Headline requested by user */}
        <h1 className="mt-8 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Oppsss bro... this page doesn&apos;t exist!
        </h1>

        {/* Typed Path Preview */}
        {pathname && (
          <div className="mt-3.5 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-3.5 py-1.5 text-xs sm:text-sm font-mono text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
            <span className="text-gray-400">Target:</span>
            <span className="font-semibold text-red-500 line-through">
              {pathname}
            </span>
            <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">
              Unreachable
            </span>
          </div>
        )}

        {/* Humorous fintech / subscription explanation */}
        <p className="mt-4 max-w-lg text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Looks like you took a wrong turn in the subscription multiverse, or
          this page never renewed its plan. Don&apos;t worry, your wallet and
          actual subscriptions are 100% safe!
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F7317] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:opacity-90 dark:bg-[#B8F27C] dark:text-[#101713]"
          >
            <Home size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-black/5 dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-black/5 dark:border-white/10 dark:bg-[#1B2720] dark:text-gray-300 dark:hover:bg-white/5"
          >
            <CreditCard size={16} />
            <span>Browse 350+ Subscriptions</span>
          </Link>
        </div>

        {/* Quick Teleport Section */}
        <div className="mt-12 w-full max-w-3xl rounded-2xl border border-black/10 bg-white/70 p-5 sm:p-6 text-left shadow-xs backdrop-blur-xs dark:border-white/10 dark:bg-[#1B2720]/70">
          <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/5">
            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              🚀 Quick Teleport to Valid Pages
            </p>
            <span className="text-[11px] text-[#2F7317] dark:text-[#B8F27C] font-medium">
              SubSentra Navigation
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-xl border border-black/5 bg-white p-3.5 shadow-2xs transition hover:border-[#2F7317]/40 hover:shadow-xs dark:border-white/5 dark:bg-[#101713]/80 dark:hover:border-[#B8F27C]/30"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color} transition group-hover:scale-105`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#2F7317] dark:text-white dark:group-hover:text-[#B8F27C] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-10 text-center text-xs text-gray-400 dark:text-gray-500 py-2">
        SubSentra · Your Money, Under Control · 404 Page Not Found
      </footer>
    </main>
  );
}
