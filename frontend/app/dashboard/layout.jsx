import Sidebar from '../sidebar/page';
 

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-end items-center p-4 border-b">
         
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}