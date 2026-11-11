
import { ArrowUpRight } from "lucide-react";

const subscriptions = [
  {
    name: "Netflix",
    category: "Streaming",
    price: "$19.99",
    initials: "N",
  },
  {
    name: "Spotify",
    category: "Music",
    price: "$12.99",
    initials: "S",
  },
  {
    name: "ChatGPT Plus",
    category: "AI Tools",
    price: "$20.00",
    initials: "C",
  },
  {
    name: "iCloud+",
    category: "Cloud Storage",
    price: "$2.99",
    initials: "i",
  },
];

export default function SubscriptionList() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B2720] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Active Subscriptions
          </h3>

          <p className="text-sm text-gray-400">
            Your recurring payments
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm text-[#B8F27C]">
          View all <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <div
            key={sub.name}
            className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-bold text-[#B8F27C]">
                {sub.initials}
              </div>

              <div>
                <p className="font-medium text-white">
                  {sub.name}
                </p>

                <p className="text-xs text-gray-400">
                  {sub.category}
                </p>
              </div>
            </div>

            <p className="font-semibold text-white">
              {sub.price}
              <span className="text-xs text-gray-500">/mo</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
