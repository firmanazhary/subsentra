
import Sidebar from "@/components/sidebar";
import SubscriptionSelector from "@/components/subscription-selector";

export default function SubscriptionsPage() {
  return (
    <main className="min-h-screen bg-[#101713]">
      <Sidebar />

      <div className="ml-64 p-8">
        <SubscriptionSelector />
      </div>
    </main>
  );
}
