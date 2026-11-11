import Sidebar from "@/components/sidebar";
import SubscriptionSelector from "@/components/subscription-selector";

export default function SubscriptionsPage() {
  return (
    <main className="min-h-screen bg-[#F4F6F4] text-gray-900 transition-colors duration-200 dark:bg-[#101713] dark:text-white">
      <Sidebar />

      <div className="ml-0 min-w-0 p-4 pt-20 sm:p-6 sm:pt-22 lg:ml-64 lg:p-8 lg:pt-8 transition-all">
        <SubscriptionSelector />
      </div>
    </main>
  );
}
