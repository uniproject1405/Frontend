import { TextField } from "@mui/material";
import FormField from "./FormField.jsx";

export default function EmailField({ id = "email", error }) {
  return (
    <FormField id={id} label="ایمیل" error={error}>
      <TextField
        id={id}
        name="email"
        type="email"
        autoComplete="email"
        error={Boolean(error)}
        placeholder="you@example.com"
        slotProps={{
          // متن انگلیسی از چپ به راست، ولی کنار راست فیلد چیده می‌شود
          htmlInput: {
            dir: "ltr",
            style: { textAlign: "right" },
            "aria-describedby": error ? `${id}-error` : undefined,
          },
        }}
      />
    </FormField>
  );
}
