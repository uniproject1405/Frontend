import { useCallback, useState } from "react";

import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorMessages.js";
import { EMAIL_RE, EMPTY_MSG } from "../utils/validation.js";
import { useFieldError } from "../hooks/useFieldError.js";

import AuthLayout from "../layouts/AuthLayout.jsx";
import EmailField from "../components/EmailField.jsx";
import FormField, { FieldBubble } from "../components/FormField.jsx";
import FormMessage from "../components/FormMessage.jsx";
import { useGoogleReturn } from "../hooks/useGoogleReturn.js";
import GoogleButton from "../components/GoogleButton.jsx";
import PasswordField from "../components/PasswordField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";

const HAS_LETTER = /[A-Za-z\u0600-\u065F\u066E-\u06D3]/;
const HAS_DIGIT = /[0-9\u0660-\u0669\u06F0-\u06F9]/;

export default function Signup() {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { errorFor, fail, clear, onInput } = useFieldError();

  function showError(text) {
    setMessage(text);
    setMessageType("error");
  }

  const showInfo = useCallback((text) => {
    setMessage(text);
    setMessageType("info");
  }, []);
  const showGoogleError = useCallback((text) => {
    setMessage(text);
    setMessageType("error");
  }, []);
  const startGoogle = useGoogleReturn("signup", showGoogleError, showInfo);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (!name) return fail(form, "name", EMPTY_MSG);
    if (name.length > 150) {
      return fail(form, "name", "نام نباید بیشتر از ۱۵۰ نویسه باشد.");
    }

    if (!email) return fail(form, "email", EMPTY_MSG);
    if (!EMAIL_RE.test(email)) {
      return fail(form, "email", "ایمیل واردشده معتبر نیست.");
    }

    if (!password) return fail(form, "password", EMPTY_MSG);
    if (password.length < 8) {
      return fail(form, "password", "رمز عبور باید حداقل ۸ نویسه باشد.");
    }
    if (!HAS_LETTER.test(password) || !HAS_DIGIT.test(password)) {
      return fail(form, "password", "رمز عبور باید هم حروف داشته باشد و هم عدد.");
    }

    if (!confirm) return fail(form, "confirm", EMPTY_MSG);
    if (confirm !== password) {
      return fail(form, "confirm", "تکرار رمز عبور با رمز عبور یکسان نیست.");
    }

    if (!accepted) {
      return fail(form, "terms", "برای ادامه باید قوانین و حریم خصوصی را بپذیرید.");
    }

    setMessage("");
    setLoading(true);

    try {
      await register(name, email, password);
    } catch (error) {
      // خطای نام یا ایمیل تکراری کنار همان فیلد نشان داده می‌شود
      if (error.status === 400 && error.data?.username) {
        fail(form, "name", "این نام قبلاً ثبت شده است. نام دیگری امتحان کنید.");
      } else if (error.status === 400 && error.data?.email) {
        fail(form, "email", "این ایمیل قبلاً ثبت شده است. وارد شوید یا ایمیل دیگری امتحان کنید.");
      } else {
        showError(getErrorMessage(error, "register"));
      }
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="ایجاد حساب کاربری"
      switchPrompt="حساب کاربری دارید؟"
      switchLabel="وارد شوید"
      switchTo="/login"
      showcase={{
        kicker: "جایی برای شکل‌گرفتن اتفاق‌های تازه",
        line1: "هر مهارت،",
        line2: "یک تکه از پازل.",
      }}
    >
      <GoogleButton label="ثبت‌نام با گوگل" onClick={startGoogle} />

      <Divider className="auth-divider">یا</Divider>

      <Box component="form" onSubmit={handleSubmit} onInput={onInput} noValidate>
        <Stack spacing={2}>
          <FormField
            id="signup-name"
            label="نام کاربری"
            error={errorFor("name")}
          >
            <TextField
              id="signup-name"
              name="name"
              placeholder="یک نام کاربری برای خود انتخاب کنید"
              autoComplete="username"
              error={Boolean(errorFor("name"))}
              slotProps={{
                htmlInput: {
                  "aria-describedby": errorFor("name") ? "signup-name-error" : undefined,
                },
              }}
              fullWidth
            />
          </FormField>

          <EmailField id="signup-email" error={errorFor("email")} />

          <Box>
            <Box className="auth-row-2">
              <PasswordField
                id="signup-password"
                autoComplete="new-password"
                placeholder="حداقل ۸ کاراکتر"
                error={errorFor("password")}
              />
              <PasswordField
                id="signup-confirm"
                name="confirm"
                label="تکرار رمز عبور"
                placeholder="تکرار رمز عبور"
                autoComplete="new-password"
                error={errorFor("confirm")}
              />
            </Box>
            <Typography className="auth-hint">
              ترکیبی از حروف و عدد، حداقل ۸ نویسه.
            </Typography>
          </Box>

          {/* پذیرش قوانین */}
          <Box className="auth-field">
            <FormControlLabel
              className="auth-check"
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(event) => {
                    setAccepted(event.target.checked);
                    clear("terms");
                  }}
                  color="primary"
                  slotProps={{
                    input: {
                      "aria-invalid": Boolean(errorFor("terms")),
                      "aria-describedby": errorFor("terms") ? "terms-error" : undefined,
                    },
                  }}
                />
              }
              label={
                <span className="terms-checkbox-label">
                  قوانین و{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    حریم خصوصی
                  </a>{" "}
                  Tribe را می‌پذیرم.
                </span>
              }
            />
            {errorFor("terms") && (
              <FieldBubble id="terms-error">{errorFor("terms")}</FieldBubble>
            )}
          </Box>

          <FormMessage message={message} type={messageType} />

          <SubmitButton loading={loading} loadingText="در حال ساخت حساب...">
            ثبت‌نام
          </SubmitButton>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
