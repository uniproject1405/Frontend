import { Link } from "react-router";

import { sections } from "./termsContent.jsx";
import "./terms.css";

const pad = (n) => String(n).padStart(2, "0");

export default function TermsPage() {
  return (
    <div className="terms-page">
      <header className="terms-bar">
        <Link to="/" className="terms-logo" aria-label="Tribe">
          <img src="/tribe-logo.svg" alt="Tribe" />
        </Link>
        <Link to="/signup" className="terms-back">
          بازگشت به ثبت‌نام
        </Link>
      </header>

      <main className="terms-main">
        <section className="terms-heading">
          <p className="terms-kicker">جامعه Tribe</p>
          <h1>قوانین و حریم خصوصی</h1>
          <p className="terms-lead">
            برای تجربه‌ای امن و سازنده در Tribe، لطفاً این قوانین را مطالعه کنید.
          </p>
        </section>

        <div className="terms-layout">
          <aside className="terms-index">
            <h2>فهرست مطالب</h2>
            {sections.map((section, index) => (
              <a href={`#terms-${index + 1}`} key={section.title}>
                <span>{pad(index + 1)}</span>
                {section.title}
              </a>
            ))}
          </aside>

          <article className="terms-document">
            <div className="terms-welcome">
              <span className="terms-welcome-icon" aria-hidden="true">✦</span>
              <div>
                <h2>به Tribe خوش آمدید!</h2>
                <p>
                  استفاده از Tribe به معنای پذیرش شرایط این صفحه است. هدف ما
                  ایجاد فضایی برای همکاری، یادگیری و ارتباط سازنده میان افراد است.
                </p>
              </div>
            </div>

            {sections.map((section, index) => (
              <section
                className="terms-section"
                id={`terms-${index + 1}`}
                key={section.title}
              >
                <h2>
                  <span>{pad(index + 1)}</span>
                  {section.title}
                </h2>
                <div className="terms-section-body">{section.content}</div>
              </section>
            ))}

            <div className="terms-closing">
              <span aria-hidden="true">✦</span>
              <p>
                از اینکه بخشی از جامعه Tribe هستید سپاسگزاریم. با همکاری و احترام
                متقابل، این جامعه را بهتر می‌سازیم.
              </p>
            </div>
          </article>
        </div>

        <footer className="terms-footer">
          <span>© Tribe · tribehub.ir</span>
          <span>هر مهارت، یک تکه از پازل.</span>
          <Link to="/signup">بازگشت به ثبت‌نام</Link>
        </footer>
      </main>
    </div>
  );
}
