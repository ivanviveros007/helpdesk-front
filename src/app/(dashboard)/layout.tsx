import { Sidebar } from "@/components/layout/Sidebar";
import { UserGreeting } from "@/components/layout/UserGreeting";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <UserGreeting />
        {children}
      </main>
    </div>
  );
}
