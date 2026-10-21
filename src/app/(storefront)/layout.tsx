import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Customer-facing shell: branded header, page content, footer.
// Admin routes live in the (admin) route group and never see this layout.
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
