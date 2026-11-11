
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
    <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>

        <div className="rounded-xl bg-white/5 p-2">
          <Icon size={20} className="text-[#B8F27C]" />
        </div>
      </div>

      <h2 className="mt-5 text-3xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-2 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}
