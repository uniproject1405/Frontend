import { useState } from "react";

import {
  Box,
  Stack,
} from "@mui/material";


import AuthLayout from "../layouts/AuthLayout.jsx";
import EmailField from "../components/EmailField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import FormMessage from "../components/FormMessage.jsx";
import { EMAIL_RE, EMPTY_MSG } from "../utils/validation.js";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../utils/errorMessages.js";
import { useFieldError } from "../hooks/useFieldError.js";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const { errorFor, fail, onInput } = useFieldError();

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    setMessage("");

    if (!email) return fail(form, "email", EMPTY_MSG);
    if (!EMAIL_RE.test(email)) return fail(form, "email", "ایمیل واردشده معتبر نیست.");

    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      // بک‌اند برای جلوگیری از شناسایی حساب‌ها همیشه موفق جواب می‌دهد
      setMessage("اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی برایتان ارسال شد.");
      setMessageType("success");
    } catch (error) {
      setMessage(getErrorMessage(error, "forgot"));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      switchPrompt="رمز عبور خود را به یاد آوردید؟"
      switchLabel="ورود"
      switchTo="/login"
      title="بازیابی رمز عبور"
      subtitle="ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برایتان ارسال شود."
      showcase={{
        kicker: "جایی برای شکل‌گرفتن اتفاق‌های تازه",
        line1: "هر مهارت،",
        line2: "یک تکه از پازل.",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        onInput={onInput}
        noValidate
      >
        <Stack spacing={2.5}>
          <EmailField id="forgot-email" error={errorFor("email")} />

          <FormMessage
            message={message}
            type={messageType}
          />

          <SubmitButton
            loading={loading}
            loadingText="در حال ارسال..."
          >
            ارسال لینک بازیابی
          </SubmitButton>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
