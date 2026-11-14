
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Divider,
  Link,
  Stack,
} from "@mui/material";

import { useAuth } from "../useAuth.js";
import { getErrorMessage } from "../../../api/index.js";
import { EMAIL_RE, EMPTY_MSG, useFieldError } from "../validation.js";

import AuthLayout from "../components/AuthLayout.jsx";
import EmailField from "../components/EmailField.jsx";
import FormMessage from "../components/FormMessage.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const { login } = useAuth();
  const { errorFor, fail, onInput } = useFieldError();

  function showError(text) {
    setMessage(text);
    setMessageType("error");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email) return fail(form, "email", EMPTY_MSG);
    if (!EMAIL_RE.test(email)) return fail(form, "email", "ایمیل واردشده معتبر نیست.");
    if (!password) return fail(form, "password", EMPTY_MSG);

    setMessage("");
    setLoading(true);

    try {
      await login(email, password);
      // بعد از موفقیت، PublicOnlyRoute کاربر را خودکار منتقل می‌کند
    } catch (error) {
      showError(getErrorMessage(error, "login"));
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      switchPrompt="حساب کاربری ندارید؟"
      switchLabel="ثبت‌نام کنید"
      switchTo="/signup"
      title="ورود به Tribe"
      showcase={{
        kicker: "جایی برای شکل‌گرفتن اتفاق‌های تازه",
        line1: "هر مهارت،",
        line2: "یک تکه از پازل.",
      }}
    >
      <GoogleButton
        onClick={() => {
          setMessage("برای ادامه، حساب گوگل خود را انتخاب کنید.");
          setMessageType("info");
        }}
      />

      <Divider className="auth-divider">
        یا
      </Divider>

      <Box component="form" onSubmit={handleSubmit} onInput={onInput} noValidate>
        <Stack spacing={2.2}>
          <EmailField id="login-email" error={errorFor("email")} />

          <PasswordField
            id="login-password"
            error={errorFor("password")}
            autoComplete="current-password"
            action={
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                className="auth-forgot"
              >
                فراموشی رمز عبور؟
              </Link>
            }
          />

          <FormMessage
            message={message}
            type={messageType}
          />

          <SubmitButton
            loading={loading}
            loadingText="در حال ورود…"
          >
            ورود
          </SubmitButton>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
