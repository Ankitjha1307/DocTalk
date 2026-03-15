import Sidebar from '@/components/sidebar';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'Dashboard - DocTalk',
  description: 'Manage your health with DocTalk',
};

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto mt-16 lg:mt-16">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
