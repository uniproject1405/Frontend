/*
  تصویر پنل چپ: کارت کج پروژه، چیپ‌های شناور و مدار نقطه‌چین.
  با HTML/CSS ساخته شده تا از فونت وزیرمتن استفاده کند و واضح بماند.
  استایل: کلاس‌های hv-* در auth.css
*/
export default function HeroVisual() {
  return (
    <div className="auth-hero" aria-hidden="true">
      <div className="hero-visual">
        <span className="hv-ring" />
        <span className="hv-orbit" />
        <span className="hv-dot hv-dot-1" />
        <span className="hv-dot hv-dot-2" />

        <span className="hv-pill hv-pill-figma">Figma</span>
        <span className="hv-pill hv-pill-react">React</span>
        <span className="hv-pill hv-pill-research">Research</span>

        {/* کارت پروژه */}
        <div className="hv-card">
          <div className="hv-card-top">
            <span className="hv-card-dot" />
            <span>پروژه تازه</span>
          </div>

          <div className="hv-art">
            <i className="hv-arch hv-arch-1" />
            <i className="hv-arch hv-arch-2" />
            <i className="hv-arch hv-arch-3" />
          </div>

          <div className="hv-title">
            ساخت یک تجربه
            <br />
            برای یادگیری جمعی
          </div>

          <div className="hv-card-foot">
            <span className="hv-people">
              <b style={{ background: "#0b1b3d", color: "#fff" }}>+</b>
              <b style={{ background: "#ecdcc4" }}>ر</b>
              <b style={{ background: "#a7b6c9" }}>م</b>
            </span>
            <span>۳ جای خالی</span>
          </div>
        </div>

        {/* چیپ ایده */}
        <div className="hv-chip hv-chip-idea">
          <svg viewBox="0 0 24 24" width="2em" height="2em" fill="#c99a5b" aria-hidden="true">
            <path d="M12 2c.6 5.200 3.800 8.400 9 9-5.200.6-8.400 3.800-9 9-.6-5.200-3.800-8.400-9-9 5.200-.6 8.400-3.800 9-9Z" />
          </svg>
          <span>
            <small>یک ایده داری؟</small>
            <strong>آدم‌هایش را پیدا کن</strong>
          </span>
        </div>

        {/* چیپ عضو جدید */}
        <div className="hv-chip hv-chip-member">
          <span className="hv-member-avatar">س</span>
          <span>
            <strong>سارا به تیم پیوست</strong>
            <small>طراح تجربه کاربری</small>
          </span>
        </div>
      </div>
    </div>
  );
}
