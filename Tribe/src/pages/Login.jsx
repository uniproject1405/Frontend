
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";

import {
  Box,
  Divider,
  Link,
  Stack,
} from "@mui/material";

import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorMessages.js";
import { EMAIL_RE, EMPTY_MSG } from "../utils/validation.js";
import { useFieldError } from "../hooks/useFieldError.js";

import AuthLayout from "../layouts/AuthLayout.jsx";
import EmailField from "../components/EmailField.jsx";
import FormMessage from "../components/FormMessage.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const { login, completeGoogleLogin } = useAuth();
  const { errorFor, fail, onInput } = useFieldError();

  function showError(text) {
    setMessage(text);
    setMessageType("error");
  }

  // دریافت نتیجه ورود گوگل
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const email = params.get("email");
    const username = params.get("username");
    const googleError = params.get("error");

    if (token) {
      completeGoogleLogin(token, {
        email: email || "",
        username: username || email || "",
      });

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    } else if (googleError) {
      showError(googleError);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [completeGoogleLogin]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email) {
      return fail(form, "email", EMPTY_MSG);
    }

    if (!EMAIL_RE.test(email)) {
      return fail(form, "email", "ایمیل واردشده معتبر نیست.");
    }

    if (!password) {
      return fail(form, "password", EMPTY_MSG);
    }

    setMessage("");
    setLoading(true);

    try {
      await login(email, password);
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
        label="ورود با گوگل"
        onClick={() => {
          window.location.assign(
            "/api/users/google/login/?mode=login"
          );
        }}
      />

      <Divider className="auth-divider">
        یا
      </Divider>

      <Box
        component="form"
        onSubmit={handleSubmit}
        onInput={onInput}
        noValidate
      >
        <Stack spacing={2.2}>
          <EmailField
            id="login-email"
            error={errorFor("email")}
          />

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
