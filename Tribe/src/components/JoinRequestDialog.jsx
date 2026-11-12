import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

import { createJoinRequest } from "../services/membershipService";

const MAX = 300;

function JoinRequestDialog({ project, open, onClose, onSent }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    if (sending) return;
    setSending(true);
    setError("");
    try {
      await createJoinRequest(project.id, message);
      setMessage("");
      onSent();
    } catch (e) {
      setError(e.message || "ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onClose={sending ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>پیوستن به {project.title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>مالک پروژه درخواست شما را بررسی می‌کند.</DialogContentText>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          margin="dense"
          placeholder="یک پیام کوتاه بنویسید (اختیاری)"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
          helperText={message.length > 240 ? `${message.length}/${MAX}` : " "}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={sending}>انصراف</Button>
        <Button variant="contained" onClick={send} disabled={sending}>ارسال درخواست</Button>
      </DialogActions>
    </Dialog>
  );
}

export default JoinRequestDialog;
