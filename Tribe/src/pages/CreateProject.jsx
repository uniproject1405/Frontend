import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, IconButton, Stack, TextField, Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { createProject } from "../services/projectService";
import { validateProject, validateProjectStep } from "../utils/projectValidation";

const EMPTY = { title: "", goal: "", description: "", requiredSkills: "", capacity: "" };
const STEPS = ["اطلاعات پایه", "معرفی پروژه", "تیم و مهارت‌ها", "بازبینی"];
const NAVY = "#071739";
const BLUE = "#4B6382";
const BORDER = "#E3E8EF";
const SOFT = "#F4F6FA";

const fieldStyle = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    bgcolor: "#FFFFFF",
    borderRadius: "10px",
    fontSize: 14,
    minHeight: 49,
    "& fieldset": { borderColor: BORDER },
    "&:hover fieldset": { borderColor: "#A4B5C4" },
    "&.Mui-focused fieldset": { borderColor: NAVY, borderWidth: 1.5 },
  },
  "& .MuiFormHelperText-root": { mx: 0, mt: 0.7, fontSize: 11, color: BLUE },
};

const fieldLabelSx = {
  fontWeight: 700,
  fontSize: 12.5,
  color: NAVY,
  mb: 1,
};

/**
 * Default use: <CreateProject /> for the /create-project route.
 * Dashboard modal use: <CreateProject open={open} onClose={...} onCreated={...} />
 */
function CreateProject({ open = true, onClose, onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY });
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [saved, setSaved] = useState(false);
  const refs = useRef({});

  const dirty = Object.values(form).some((v) => String(v).trim()) || Boolean(skillInput.trim());

  useEffect(() => {
    if (!open || !dirty || saved) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [open, dirty, saved]);

  function clearForm() {
    setForm({ ...EMPTY }); setSkills([]); setSkillInput("");
    setStep(0); setErrors({}); setMessage(""); setSaved(false);
  }

  function finishClose() {
    setConfirmClose(false);
    clearForm();
    if (onClose) onClose();
    else navigate("/my-projects");
  }

  function requestClose() {
    if (submitting) return;
    if (dirty && !saved) setConfirmClose(true);
    else finishClose();
  }

  function change(event) {
    const { name, value } = event.target;
    setForm((old) => ({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: "" }));
    setMessage("");
  }

  function addSkill(raw = skillInput) {
    const value = raw.trim();
    if (!value) return;
    const updated = skills.some((skill) => skill.toLowerCase() === value.toLowerCase())
      ? skills : [...skills, value];
    setSkills(updated);
    setForm((old) => ({ ...old, requiredSkills: updated.join(", ") }));
    setSkillInput("");
    setErrors((old) => ({ ...old, requiredSkills: "" }));
  }

  function removeSkill(value) {
    const updated = skills.filter((skill) => skill !== value);
    setSkills(updated);
    setForm((old) => ({ ...old, requiredSkills: updated.join(", ") }));
  }

  function fieldErrors(data, currentStep) {
    if (currentStep === 3) return validateProject(data);
    // Preserve existing validation rules even though the design has four visual steps.
    const source = validateProjectStep(data, currentStep === 2 ? 1 : 0);
    const names = currentStep === 0 ? ["title", "goal"]
      : currentStep === 1 ? ["description"] : ["requiredSkills", "capacity"];
    return Object.fromEntries(Object.entries(source).filter(([name]) => names.includes(name)));
  }

  async function next(event) {
    event.preventDefault();
    if (submitting) return;
    const pending = skillInput.trim();
    const finalSkills = [...skills];
    if (pending && !finalSkills.some((s) => s.toLowerCase() === pending.toLowerCase())) {
      finalSkills.push(pending);
    }
    const data = { ...form, requiredSkills: finalSkills.join(", ") };
    setSkills(finalSkills); setSkillInput(""); setForm(data); setMessage("");
    const invalid = fieldErrors(data, step);
    setErrors(invalid);
    const first = Object.keys(invalid).find((key) => invalid[key]);
    if (first) { refs.current[first]?.focus(); return; }
    if (step < 3) { setStep((s) => s + 1); return; }
    setSubmitting(true);
    try {
      await createProject({ ...data, requiredSkills: finalSkills, capacity: Number(data.capacity) });
      setSaved(true);
      if (onCreated) await onCreated();
      finishClose();
    } catch (error) {
      setMessage(error?.message || "ایجاد پروژه انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  }

  const input = (name, label, placeholder, limit, extra = {}) => (
    <Box key={name}>
      <Typography component="label" htmlFor={`project-${name}`} sx={fieldLabelSx}>
        {label} <Box component="span" sx={{ color: "#A68868" }}>*</Box>
      </Typography>
      <TextField
        id={`project-${name}`}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={change}
        error={Boolean(errors[name])}
        helperText={errors[name] || `${form[name].length}/${limit} کاراکتر`}
        inputRef={(node) => { refs.current[name] = node; }}
        slotProps={{ htmlInput: { maxLength: limit } }}
        required
        sx={fieldStyle}
        {...extra}
      />
    </Box>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={requestClose}
        className="tribe-create-project-dialog"
        fullWidth
        maxWidth={false}
        aria-labelledby="create-project-dialog-title"
        slotProps={{
          backdrop: { sx: { bgcolor: "rgba(11,27,59,0.46)", backdropFilter: "blur(7px)" } },
          paper: {
            sx: {
              width: "min(790px, calc(100% - 24px))",
              maxHeight: "calc(100dvh - 40px)",
              m: 1.5,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: "18px",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 24px 70px rgba(11,27,59,.18)",
            },
          },
        }}
      >
        {/* Simple, shared Tribe visual language; header stays visible on scroll. */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: { xs: 2.5, sm: 3 }, pb: 2.5, flexShrink: 0,
          bgcolor: "#FFFFFF", borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ display: "flex", gap: 1.8, alignItems: "center" }}>
            <Box sx={{ width: 43, height: 43, borderRadius: "11px", bgcolor: "#EDF1F5",
              display: "grid", placeItems: "center", color: NAVY, flexShrink: 0 }}>
              <FolderOutlinedIcon sx={{ fontSize: 23 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography id="create-project-dialog-title" sx={{
                fontSize: { xs: 20, sm: 24 }, fontWeight: 700, color: NAVY, lineHeight: 1.4,
              }}>ایجاد پروژه جدید</Typography>
              <Typography sx={{ color: BLUE, fontSize: 12.5, mt: 0.4 }}>
                ایده‌تان را مرحله‌به‌مرحله به یک پروژه واقعی تبدیل کنید.
              </Typography>
            </Box>
            <IconButton onClick={requestClose} disabled={submitting} aria-label="بستن فرم ایجاد پروژه"
              sx={{ color: BLUE, bgcolor: SOFT, "&:hover": { bgcolor: "#E9EEF5" } }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Four-step indicator */}
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 2.3, bgcolor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
            {STEPS.map((label, index) => (
              <Box key={label} sx={{ position: "relative", display: "flex", alignItems: "center",
                flexDirection: "column", gap: .9, minWidth: 0, zIndex: 0 }}>
                {index < 3 && <Box sx={{ position: "absolute", top: 16, left: "50%", width: "100%", height: 2,
                  bgcolor: index < step ? NAVY : BORDER, zIndex: -1 }} />}
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center",
                  fontWeight: 700, fontSize: 13, border: index <= step ? "none" : `1px solid ${BORDER}`,
                  bgcolor: index <= step ? NAVY : SOFT, color: index <= step ? "white" : "#7E91A6" }}>
                  {index < step ? <CheckRoundedIcon fontSize="small" /> : index + 1}
                </Box>
                <Typography sx={{ fontSize: { xs: 9, sm: 11.5 }, fontWeight: index === step ? 700 : 500,
                  color: index === step ? NAVY : BLUE, textAlign: "center" }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={next}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <DialogContent
            sx={{
              px: { xs: 2.5, sm: 4 },
              pt: "25px !important",
              pb: 3,
              bgcolor: "#FFFFFF",
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              overscrollBehavior: "contain",
              scrollbarWidth: "thin",
              scrollbarColor: "#CDD5DB transparent",
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: 18 }}>
                  {step === 0 ? "اطلاعات اولیه" : step === 1 ? "درباره پروژه‌تان بگویید"
                    : step === 2 ? "نیازهای تیم" : "بازبینی پروژه"}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: BLUE, mt: .6 }}>
                  {step === 0 ? "با نام پروژه و هدف اصلی آن شروع کنیم."
                    : step === 1 ? "به همکاران کمک کنید تا با ایده و جزئیات پروژه آشنا شوند."
                    : step === 2 ? "مهارت‌های موردنیاز و ظرفیت تیم را مشخص کنید."
                    : "پیش از ایجاد پروژه، اطلاعات واردشده را بررسی کنید."}
                </Typography>
              </Box>

              {step === 0 && <>
                {input("title", "عنوان پروژه", "مثلاً: دستیار هوشمند مطالعه", 80)}
                {input("goal", "هدف پروژه", "می‌خواهید به چه هدفی برسید؟", 160)}
              </>}
              {step === 1 && input("description", "توضیحات پروژه", "ایده و جزئیات پروژه خود را شرح دهید...", 1000,
                { multiline: true, minRows: 4, maxRows: 7 })}
              {step === 2 && <>
                <Box>
                  <Typography component="label" htmlFor="project-skills" sx={fieldLabelSx}>
                    مهارت‌های موردنیاز <Box component="span" sx={{ color: "#A68868" }}>*</Box>
                  </Typography>
                  <TextField id="project-skills" placeholder="نام مهارت را وارد کنید"
                    value={skillInput} onChange={(e) => { setSkillInput(e.target.value);
                      setErrors((old) => ({ ...old, requiredSkills: "" })); }}
                    onKeyDown={(e) => { if (["Enter", ","].includes(e.key)) { e.preventDefault(); addSkill(); }
                      if (e.key === "Backspace" && !skillInput && skills.length) removeSkill(skills.at(-1)); }}
                    onBlur={() => addSkill()} inputRef={(node) => { refs.current.requiredSkills = node; }}
                    error={Boolean(errors.requiredSkills)} helperText={errors.requiredSkills || "برای افزودن مهارت، کلید Enter را فشار دهید"}
                    required sx={fieldStyle} />
                </Box>
                {skills.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      columnGap: "12px",
                      rowGap: "10px",
                      mt: 1,
                    }}
                  >
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => removeSkill(skill)}
                        sx={{
                          height: 32,
                          borderRadius: "10px",
                          bgcolor: NAVY,
                          color: "#FFFFFF",
                          fontWeight: 600,
                          fontSize: 12,
                          "& .MuiChip-label": { px: 1.3 },
                          "& .MuiChip-deleteIcon": {
                            ml: 0.5,
                            mr: 0.75,
                            color: "rgba(255,255,255,0.85)",
                            "&:hover": { color: "#FFFFFF" },
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
                <Box>
                  <Typography component="label" htmlFor="project-capacity" sx={fieldLabelSx}>
                    ظرفیت تیم <Box component="span" sx={{ color: "#A68868" }}>*</Box>
                  </Typography>
                  <TextField id="project-capacity" name="capacity" value={form.capacity}
                    placeholder="تعداد اعضای تیم"
                    onChange={(e) => change({ target: { name: "capacity", value: e.target.value.replace(/\D/g, "").slice(0, 5) } })}
                    inputRef={(node) => { refs.current.capacity = node; }}
                    slotProps={{ htmlInput: { inputMode: "numeric" } }}
                    error={Boolean(errors.capacity)} helperText={errors.capacity || "تعداد اعضای تیم"}
                    required sx={fieldStyle} />
                </Box>
              </>}
              {step === 3 && <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 2 }}>
                {[["عنوان پروژه", form.title], ["هدف پروژه", form.goal], ["توضیحات", form.description],
                  ["مهارت‌های موردنیاز", skills.join("، ")], ["ظرفیت تیم", form.capacity]].map(([label, value], index) => (
                  <Box key={label} sx={{ py: 1.1, borderBottom: index === 4 ? 0 : `1px solid ${BORDER}` }}>
                    <Typography sx={{ fontSize: 11, color: BLUE, fontWeight: 600 }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13.5, color: NAVY, mt: .3, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                      {value || "—"}
                    </Typography>
                  </Box>
                ))}
              </Box>}
              {message && <Alert severity="error">{message}</Alert>}
            </Stack>
          </DialogContent>
          <Divider sx={{ flexShrink: 0, borderColor: BORDER }} />
          <DialogActions sx={{ px: { xs: 2.5, sm: 4 }, py: 2, display: "flex", gap: 1, flexShrink: 0, bgcolor: "#FFFFFF" }}>
            <Button type="button" onClick={requestClose} disabled={submitting} variant="outlined"
              sx={{ mr: "auto", color: NAVY, borderColor: BORDER, borderRadius: "9px",
                fontSize: 13, "&:hover": { bgcolor: SOFT, borderColor: "#A4B5C4" } }}>انصراف</Button>
            {step > 0 && <Button type="button" onClick={() => { setStep(step - 1); setErrors({}); setMessage(""); }}
              startIcon={<ArrowBackRoundedIcon />} variant="outlined"
              sx={{ color: NAVY, borderColor: BORDER, borderRadius: "9px", fontSize: 13,
                "&:hover": { bgcolor: SOFT, borderColor: "#A4B5C4" } }}>قبلی</Button>}
            <Button type="submit" variant="contained" disabled={submitting}
              endIcon={step === 3 ? <AutoAwesomeRoundedIcon /> : <ArrowForwardRoundedIcon />}
              sx={{ minWidth: { xs: 100, sm: 135 }, borderRadius: "9px", bgcolor: NAVY, fontSize: 13,
                "&:hover": { bgcolor: "#14285A" } }}>
              {submitting ? "در حال ایجاد..." : step === 3 ? "ایجاد پروژه" : "بعدی"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: "14px" } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: NAVY }}>صرف‌نظر از تغییرات؟</DialogTitle>
        <DialogContent><Typography sx={{ color: BLUE, fontSize: 14 }}>
          اطلاعات پروژه هنوز ذخیره نشده است.
        </Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmClose(false)}>ادامه ویرایش</Button>
          <Button color="error" variant="contained" onClick={finishClose}>صرف‌نظر</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateProject;
