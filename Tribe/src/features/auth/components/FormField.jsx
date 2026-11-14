import { Box, Typography } from "@mui/material";

/* حباب خطا: آیکون نارنجی + متن، با فلش کوچک به سمت فیلد */
export function FieldBubble({ id, children }) {
  return (
    <Box id={id} className="auth-bubble" role="alert">
      <span className="auth-bubble-icon" aria-hidden="true">!</span>
      <span>{children}</span>
    </Box>
  );
}

/*
  قالب یکسان همه فیلدها: برچسب (با لینک اختیاری کنار آن)، خود فیلد، نکته زیر آن
  و حباب خطا. id باید با id فیلد داخلش یکی باشد تا کلیک روی برچسب فیلد را فعال کند.
*/
export default function FormField({ id, label, action, hint, error, children }) {
  return (
    <Box className={`auth-field${error ? " auth-field-error" : ""}`}>
      <Box className="auth-label-row">
        <Typography component="label" htmlFor={id} className="auth-label">
          {label}
        </Typography>
        {action}
      </Box>

      {children}

      {hint && <Typography className="auth-hint">{hint}</Typography>}
      {error && <FieldBubble id={`${id}-error`}>{error}</FieldBubble>}
    </Box>
  );
}
