
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">
          Wednesday, November 11, 2026
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Your money, under control.
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl border border-white/10 p-3 text-gray-400 hover:bg-white/5">
          <Search size={19} />
        </button>

        <button className="relative rounded-xl border border-white/10 p-3 text-gray-400 hover:bg-white/5">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B8F27C]" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8F27C] font-bold text-[#142018]">
          A
        </div>
      </div>
    </header>
  );
}
    