import { useState } from "react";

/*
  خطای هر فیلد به‌صورت حباب کنار همان فیلد نشان داده می‌شود.
  فقط یک خطا در هر لحظه هست (مثل مرورگر) و با تایپ کردن در همان فیلد پاک می‌شود.

  استفاده:
    const { errorFor, fail, clear, onInput } = useFieldError();
    fail(form, "email", "متن خطا")      // خطا را نشان می‌دهد و فیلد را فوکوس می‌کند
    <Box component="form" onInput={onInput}> … error={errorFor("email")}
*/
export function useFieldError() {
  const [error, setError] = useState(null);

  const clear = (field) =>
    setError((prev) => (!field || prev?.field === field ? null : prev));

  return {
    errorFor: (field) => (error?.field === field ? error.text : ""),
    fail(form, field, text) {
      setError({ field, text });
      form.elements.namedItem(field)?.focus?.();
      return false;
    },
    clear,
    onInput: (event) => clear(event.target.name),
  };
}
