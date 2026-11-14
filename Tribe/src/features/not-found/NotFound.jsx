import { Link } from "react-router-dom";

import "./not-found.css";

export default function NotFound() {
  return (
    <main className="nf-page">
      <Link to="/" className="nf-logo" aria-label="Tribe">
        <img src="/tribe-logo.svg" alt="Tribe" />
      </Link>

      <p className="nf-code" aria-hidden="true">۴۰۴</p>
      <h1>صفحه پیدا نشد</h1>
      <p className="nf-text">آدرسی که وارد کرده‌اید وجود ندارد یا جابه‌جا شده است.</p>

      <Link to="/" className="nf-btn">
        بازگشت به صفحه اصلی
      </Link>
    </main>
  );
}
