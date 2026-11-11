import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs transition dark:border-white/10 dark:bg-[#1B2720]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

        <div className="rounded-xl bg-[#142018]/5 p-2 dark:bg-white/5">
          <Icon size={20} className="text-[#2F7317] dark:text-[#B8F27C]" />
        </div>
      </div>

      <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </h2>

      <p className="mt-2 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}
