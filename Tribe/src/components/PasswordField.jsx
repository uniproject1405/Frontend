import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOffOutlined";
import FormField from "./FormField.jsx";

/*
  فیلد رمز عبور: دکمه چشم سمت چپ فیلد (انتهای فیلد در حالت راست‌چین).
*/
export default function PasswordField({
  id = "password",
  name = "password",
  label = "رمز عبور",
  placeholder = "رمز عبور خود را وارد کنید",
  autoComplete,
  action,
  hint,
  error,
}) {
  const [show, setShow] = useState(false);

  return (
    <FormField id={id} label={label} action={action} hint={hint} error={error}>
      <TextField
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        error={Boolean(error)}
        slotProps={{
          htmlInput: { "aria-describedby": error ? `${id}-error` : undefined },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  edge="end"
                  className="auth-eye"
                  onClick={() => setShow((prev) => !prev)}
                  aria-label={show ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </FormField>
  );
}
