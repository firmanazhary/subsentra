"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n, COUNTRIES, CountryCode } from "@/context/i18n-context";
import { Currency, Language, CURRENCY_CONFIGS } from "@/types/i18n";

export default function Header() {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    selectedCountry,
    setCountry,
    t,
  } = useI18n();

  const [isOpen, setIsOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live real-time localized date and ticking clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const locale = language === "ja" ? "ja-JP" : language === "id" ? "id-ID" : "en-US";

        const dateStr = new Intl.DateTimeFormat(locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(now);

        const timeStr = new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: language === "en",
        }).format(now);

        setCurrentDateStr(`${dateStr} · ${timeStr}`);
      } catch {
        setCurrentDateStr("");
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentCountry =
    COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];

  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <p className="tabular-nums font-medium tracking-tight">
            {currentDateStr || (language === "id" ? "Memuat waktu..." : language === "ja" ? "読み込み中..." : "Loading time...")}
          </p>
        </div>

        <h1 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t("header.tagline")}
        </h1>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Country & Currency Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-800 shadow-xs transition hover:bg-black/5 dark:border-white/10 dark:bg-transparent dark:text-gray-200 dark:hover:bg-white/5"
            aria-label="Select Country and Currency"
          >
            <span className="text-base">{currentCountry.flag}</span>
            <span className="font-semibold">{currency}</span>
            <span className="hidden sm:inline text-xs text-gray-400">
              ({language.toUpperCase()})
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#2F7317] dark:text-[#B8F27C]" : "text-gray-400"
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-black/10 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#16221A] text-xs">
              {/* Country Presets */}
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {t("header.country")}
              </p>
              <div className="space-y-1 mb-3">
                {COUNTRIES.map((c) => {
                  const isSelected = selectedCountry === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountry(c.code as CountryCode);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 transition ${
                        isSelected
                          ? "bg-[#B8F27C]/20 text-[#194D0C] font-semibold dark:bg-[#B8F27C]/15 dark:text-[#B8F27C]"
                          : "text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{c.flag}</span>
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {c.defaultCurrency} · {c.defaultLang.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Currency Custom Picker */}
              <div className="border-t border-black/5 pt-2.5 dark:border-white/5">
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {t("header.currency")}
                </p>
                <div className="grid grid-cols-3 gap-1 px-1">
                  {(["USD", "JPY", "IDR"] as Currency[]).map((code) => {
                    const isCur = currency === code;
                    const config = CURRENCY_CONFIGS[code];
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setIsOpen(false);
                        }}
                        className={`rounded-lg py-1.5 text-center transition font-medium ${
                          isCur
                            ? "bg-[#B8F27C] text-[#142018] font-bold shadow-xs"
                            : "bg-black/5 text-gray-700 hover:bg-black/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                        }`}
                      >
                        {config.symbol} {code}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Custom Picker */}
              <div className="border-t border-black/5 pt-2.5 mt-2.5 dark:border-white/5">
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {t("header.language")}
                </p>
                <div className="grid grid-cols-3 gap-1 px-1">
                  {[
                    { code: "en", label: "English" },
                    { code: "ja", label: "日本語" },
                    { code: "id", label: "Indonesia" },
                  ].map((item) => {
                    const isLang = language === item.code;
                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code as Language);
                          setIsOpen(false);
                        }}
                        className={`rounded-lg py-1.5 text-center transition text-[11px] font-medium ${
                          isLang
                            ? "bg-[#B8F27C] text-[#142018] font-bold shadow-xs"
                            : "bg-black/5 text-gray-700 hover:bg-black/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#B8F27C] font-bold text-[#142018] shadow-sm text-sm">
          A
        </div>
      </div>
    </header>
  );
}
