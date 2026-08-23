import Sidebar from "@/Shared/Sidebar";

export default function DocumentationLayout({ children }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <aside className="sticky top-24 h-fit shrink-0">
        <Sidebar />
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
