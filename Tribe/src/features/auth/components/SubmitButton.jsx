import { Button, CircularProgress } from "@mui/material";

// دکمه اصلی فرم با حالت لودینگ (در ورود و ثبت‌نام یکسان است)
export default function SubmitButton({ loading, loadingText, children }) {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={loading}
      className="auth-submit"
      endIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
    >
      {loading ? loadingText : children}
    </Button>
  );
}
