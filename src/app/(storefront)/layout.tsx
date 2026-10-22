import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

// Customer-facing shell: branded header, page content, footer.
// Admin routes live in the (admin) route group and never see this layout.
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="storefront-main flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
