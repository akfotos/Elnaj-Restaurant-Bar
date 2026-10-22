import Link from "next/link";

export default function DiningInvitation() {
  return (
    <div className="dining-container dining-help-line">
      <p>Questions about a dish or an order?</p>
      <Link href="/support" className="dining-text-link">Contact our team <span aria-hidden="true">↗</span></Link>
    </div>
  );
}
