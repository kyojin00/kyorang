import AdminTopbar from "./components/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
