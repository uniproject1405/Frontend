import { useEffect, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router";

import { Box, Button, Stack } from "@mui/material";

import AuthLayout from "../layouts/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import FormMessage from "../components/FormMessage.jsx";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../utils/errorMessages.js";
import { EMPTY_MSG } from "../utils/validation.js";
import { useFieldError } from "../hooks/useFieldError.js";

const HAS_LETTER = /[A-Za-z\u0600-\u06FF]/;
const HAS_DIGIT = /[0-9\u06F0-\u06F9]/;

// صفحه‌ای که لینک ایمیل بازیابی (/reset-password?uid=..&token=..) به آن می‌آید
export default function ResetPassword() {
  const [params] = useSearchParams();
  const uid = params.get("uid") || "";
  const token = params.get("token") || "";

  // checking | valid | invalid | done
  const [state, setState] = useState(uid && token ? "checking" : "invalid");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { errorFor, fail, onInput } = useFieldError();

  useEffect(() => {
    if (!uid || !token) return;
    let active = true;
    authService
      .validateResetToken({ uid, token })
      .then(() => active && setState("valid"))
      .catch(() => active && setState("invalid"));
    return () => {
      active = false;
    };
  }, [uid, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (!password) return fail(form, "password", EMPTY_MSG);
    if (password.length < 8) return fail(form, "password", "رمز عبور باید حداقل ۸ نویسه باشد.");
    if (!HAS_LETTER.test(password) || !HAS_DIGIT.test(password)) {
      return fail(form, "password", "رمز عبور باید هم حروف داشته باشد و هم عدد.");
    }
    if (!confirm) return fail(form, "confirm", EMPTY_MSG);
    if (confirm !== password) return fail(form, "confirm", "تکرار رمز عبور با رمز عبور یکسان نیست.");

    setMessage("");
    setLoading(true);
    try {
      await authService.confirmPasswordReset({ uid, token, password });
      setState("done");
    } catch (error) {
      setMessage(getErrorMessage(error, "reset"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      switchPrompt="رمز عبور خود را به یاد آوردید؟"
      switchLabel="ورود"
      switchTo="/login"
      title="تعیین رمز عبور جدید"
      subtitle={state === "valid" ? "رمز عبور جدید خود را وارد کنید." : undefined}
      showcase={{
        kicker: "جایی برای شکل‌گرفتن اتفاق‌های تازه",
        line1: "هر مهارت،",
        line2: "یک تکه از پازل.",
      }}
    >
      {state === "checking" && <FormMessage type="info" message="در حال بررسی لینک..." />}

      {state === "invalid" && (
        <Stack spacing={2.5}>
          <FormMessage message="لینک بازیابی نامعتبر است یا منقضی شده است." />
          <Button component={RouterLink} to="/forgot-password" variant="contained" fullWidth className="auth-submit">
            درخواست لینک جدید
          </Button>
        </Stack>
      )}

      {state === "done" && (
        <Stack spacing={2.5}>
          <FormMessage type="success" message="رمز عبور با موفقیت تغییر کرد. حالا می‌توانید وارد شوید." />
          <Button component={RouterLink} to="/login" variant="contained" fullWidth className="auth-submit">
            ورود
          </Button>
        </Stack>
      )}

      {state === "valid" && (
        <Box component="form" onSubmit={handleSubmit} onInput={onInput} noValidate>
          <Stack spacing={2.2}>
            <PasswordField
              id="reset-password"
              label="رمز عبور جدید"
              placeholder="حداقل ۸ کاراکتر"
              autoComplete="new-password"
              error={errorFor("password")}
            />
            <PasswordField
              id="reset-confirm"
              name="confirm"
              label="تکرار رمز عبور"
              placeholder="تکرار رمز عبور"
              autoComplete="new-password"
              error={errorFor("confirm")}
            />
            <FormMessage message={message} />
            <SubmitButton loading={loading} loadingText="در حال ذخیره...">
              ذخیره رمز عبور
            </SubmitButton>
          </Stack>
        </Box>
      )}
    </AuthLayout>
  );
}
