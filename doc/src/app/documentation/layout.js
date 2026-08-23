import Sidebar from "@/Shared/Sidebar";

export default function DocumentationLayout({ children }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:flex lg:gap-8">
      <Sidebar />
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
