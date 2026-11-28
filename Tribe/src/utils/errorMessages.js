// پیام خطای فارسی برای نمایش به کاربر
export function getErrorMessage(error, mode = "login") {
  if (error.status === 0) {
    return "اتصال به سرور برقرار نشد. اینترنت خود را بررسی کنید و دوباره امتحان کنید.";
  }
  // ۵۰۲ و ۵۰۳ و ۵۰۴: بک‌اند خاموش است یا در دسترس نیست
  if (error.status >= 502 && error.status <= 504) {
    return "سرور در دسترس نیست. کمی بعد دوباره امتحان کنید.";
  }
  if (mode === "login" && (error.status === 401 || error.status === 400)) {
    return "ایمیل یا رمز عبور درست نیست. دوباره امتحان کنید.";
  }
  if (mode === "register" && error.status === 400) {
    // بک‌اند خطای هر فیلد را با نام همان فیلد برمی‌گرداند: { email: [...], password: [...] }
    if (error.data?.email) {
      return "این ایمیل قابل استفاده نیست؛ ممکن است قبلاً ثبت شده باشد. وارد شوید یا ایمیل دیگری امتحان کنید.";
    }
    if (error.data?.username) {
      return "این نام قبلاً استفاده شده است. نام دیگری امتحان کنید.";
    }
    if (error.data?.password) {
      return "رمز عبور پذیرفته نشد. رمزی با حداقل ۸ نویسه انتخاب کنید.";
    }
    return "اطلاعات واردشده معتبر نیست. دوباره بررسی کنید.";
  }
  if (mode === "forgot" && error.status === 400) {
    return "ایمیل واردشده معتبر نیست.";
  }
  if (mode === "reset" && error.status === 400) {
    if (error.data?.new_password) return "رمز عبور باید حداقل ۸ نویسه باشد.";
    if (error.data?.confirm_password) return "تکرار رمز عبور با رمز عبور یکسان نیست.";
    return "لینک بازیابی نامعتبر است یا منقضی شده است. دوباره درخواست بدهید.";
  }
  return "مشکلی پیش آمد. کمی بعد دوباره امتحان کنید.";
}
