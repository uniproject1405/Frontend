import { useEffect, useRef, useState } from "react";
import { Link, useBlocker, useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { createProject } from "../services/mockProjectService";

import { validateProject, validateProjectStep } from "../utils/projectValidation";

const INITIAL_FORM_DATA = {
  title: "",
  goal: "",
  description: "",
  requiredSkills: "",
  capacity: "",
};

const STEPS = ["Project Details", "Team Requirements", "Review & Submit"];

function CreateProject() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fieldRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSubmitted) return undefined;

    const timer = window.setTimeout(() => {
      navigate("/my-projects");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isSubmitted, navigate]);

  const hasUnsavedChanges =
    Object.values(formData).some((value) => String(value).trim() !== "") ||
    skillInput.trim() !== "";

  const blocker = useBlocker(
  ({ currentLocation, nextLocation }) =>
    Boolean(hasUnsavedChanges) &&
    !isSubmitted &&
    currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!hasUnsavedChanges || isSubmitted) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isSubmitted]);

  function handleStayOnPage() {
    if (blocker.state === "blocked") blocker.reset();
  }

  function handleLeavePage() {
    if (blocker.state === "blocked") blocker.proceed();
  }

  function clearFieldError(name) {
    setErrors((previousErrors) => ({ ...previousErrors, [name]: "" }));
    setMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
    clearFieldError(name);
  }

  function addSkill(value = skillInput) {
    const newSkill = value.trim();
    if (!newSkill) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === newSkill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    setSkillInput("");
    setFormData((previousData) => ({
      ...previousData,
      requiredSkills: updatedSkills.join(", "),
    }));
    clearFieldError("requiredSkills");
  }

  function removeSkill(skillToRemove) {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setFormData((previousData) => ({
      ...previousData,
      requiredSkills: updatedSkills.join(", "),
    }));
    clearFieldError("requiredSkills");
  }

  function handleSkillKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
      return;
    }

    if (event.key === "Backspace" && !skillInput.trim() && skills.length > 0) {
      const updatedSkills = skills.slice(0, -1);
      setSkills(updatedSkills);
      setFormData((previousData) => ({
        ...previousData,
        requiredSkills: updatedSkills.join(", "),
      }));
      clearFieldError("requiredSkills");
    }
  }

  function handleOpenResetDialog() {
    setResetDialogOpen(true);
  }

  function handleCancelReset() {
    setResetDialogOpen(false);
  }

  function handleConfirmReset() {
    setFormData({ ...INITIAL_FORM_DATA });
    setSkills([]);
    setSkillInput("");
    setErrors({});
    setMessage("");
    setActiveStep(0);
    setResetDialogOpen(false);
  }

  
async function handleSubmit(event) {
  event.preventDefault();
  if (isSubmitted) return;

  const pendingSkill = skillInput.trim();
  const finalSkills = [...skills];

  if (
    pendingSkill &&
    !finalSkills.some(
      (skill) => skill.toLowerCase() === pendingSkill.toLowerCase()
    )
  ) {
    finalSkills.push(pendingSkill);
  }

  const finalFormData = {
    ...formData,
    requiredSkills: finalSkills.join(", "),
  };

  setSkills(finalSkills);
  setSkillInput("");
  setFormData(finalFormData);
  setMessage("");

  const validationErrors =
    activeStep === 2
      ? validateProject(finalFormData)
      : validateProjectStep(finalFormData, activeStep);

  setErrors(validationErrors);

  const fieldOrder =
    activeStep === 0
      ? ["title", "goal", "description"]
      : activeStep === 1
        ? ["requiredSkills", "capacity"]
        : ["title", "goal", "description", "requiredSkills", "capacity"];

  const firstInvalidField = fieldOrder.find(
    (fieldName) => validationErrors[fieldName]
  );

  if (firstInvalidField) {
    fieldRefs.current[firstInvalidField]?.focus();
    return;
  }

  if (activeStep < 2) {
    setActiveStep((previousStep) => previousStep + 1);
    return;
  }

  try {
    await createProject({
      ...finalFormData,
      requiredSkills: finalSkills,
      capacity: Number(finalFormData.capacity),
    });

    setMessage("");
    setIsSubmitted(true);

  } catch (error) {
    setMessage(
      error.message || "Something went wrong while creating the project."
    );
  }
}

  function handleBackStep() {
    setErrors({});
    setMessage("");
    setActiveStep((previousStep) => Math.max(previousStep - 1, 0));
  }

  const progress = ((activeStep + 1) / STEPS.length) * 100;

  return (
    <Box sx={{ width: "100%", minWidth: 0, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", minWidth: 0 }}>
        <Button
          component={Link}
          to="/my-projects"
          startIcon={<ArrowBackRoundedIcon />}
          color="primary"
          sx={{ mb: 3 }}
        >
          Back to My Projects
        </Button>

        <Stack spacing={1} sx={{ mb: 3 }}>
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="CREATE SOMETHING GREAT"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "#E3C39D33",
              color: "#A68868",
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: 11,
            }}
          />
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "30px", sm: "36px" },
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.2,
              color: "#071739",
            }}
          >
            Create a New Project
          </Typography>
        </Stack>

        {/* Step progress */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 1 }}>
            {STEPS.map((step, index) => (
              <Box key={step} sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    label={index + 1}
                    color={index <= activeStep ? "primary" : "default"}
                    variant={index === activeStep ? "filled" : "outlined"}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: index === activeStep ? "block" : "none", sm: "block" },
                      fontWeight: index === activeStep ? 700 : 400,
                      color: index === activeStep ? "primary.main" : "text.secondary",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {step}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Box sx={{ height: 6, bgcolor: "action.hover", borderRadius: "8px", overflow: "hidden" }}>
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                bgcolor: "primary.main",
                borderRadius: "8px",
                transition: "width 180ms ease",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0,1fr)", lg: "minmax(0,1fr) 320px" }, alignItems: "start" }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            {activeStep === 0 && (
              <Card sx={{ width: "100%", minWidth: 0, borderRadius: "16px" }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Project Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tell us about your project and what you want to achieve.
                      </Typography>
                    </Box>
                    <Divider />

                    <TextField
                      label="Project Title"
                      name="title"
                      placeholder="e.g. AI Study Assistant"
                      value={formData.title}
                      onChange={handleChange}
                      error={Boolean(errors.title)}
                      required
                      inputRef={(element) => { fieldRefs.current.title = element; }}
                      inputProps={{ maxLength: 80 }}
                      helperText={errors.title || `${formData.title.length}/80 characters`}
                    />

                    <TextField
                      label="Project Goal"
                      name="goal"
                      placeholder="What is the main goal?"
                      value={formData.goal}
                      onChange={handleChange}
                      error={Boolean(errors.goal)}
                      required
                      inputRef={(element) => { fieldRefs.current.goal = element; }}
                      inputProps={{ maxLength: 160 }}
                      helperText={errors.goal || `${formData.goal.length}/160 characters`}
                    />

                    <TextField
                      label="Description"
                      name="description"
                      multiline
                      minRows={4}
                      placeholder="Describe your idea..."
                      value={formData.description}
                      onChange={handleChange}
                      error={Boolean(errors.description)}
                      required
                      inputRef={(element) => { fieldRefs.current.description = element; }}
                      inputProps={{ maxLength: 1000 }}
                      helperText={errors.description || `${formData.description.length}/1000 characters`}
                    />
                  </Stack>
                </CardContent>
              </Card>
            )}

            {activeStep === 1 && (
              <Card sx={{ width: "100%", minWidth: 0, borderRadius: "16px" }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Team Requirements
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Define the skills and team size you need.
                      </Typography>
                    </Box>
                    <Divider />

                    <Box>
                      <TextField
                        label="Required Skills"
                        placeholder="Type a skill and press Enter"
                        value={skillInput}
                        onChange={(event) => {
                          setSkillInput(event.target.value);
                          clearFieldError("requiredSkills");
                        }}
                        onKeyDown={handleSkillKeyDown}
                        onBlur={() => addSkill()}
                        error={Boolean(errors.requiredSkills)}
                        helperText={errors.requiredSkills || "Press Enter or comma to add a skill."}
                        inputRef={(element) => { fieldRefs.current.requiredSkills = element; }}
                        required
                      />

                      {skills.length > 0 && (
                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          flexWrap="wrap"
                          sx={{ mt: 2, maxWidth: "100%", overflowWrap: "anywhere" }}
                        >
                          {skills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              onDelete={() => removeSkill(skill)}
                              sx={{ bgcolor: "#F0F3F8", color: "#4B6382", fontWeight: 600 }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>

                    <TextField
                      label="Team Capacity"
                      name="capacity"
                      type="text"
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 5 }}
                      value={formData.capacity}
                      onChange={(event) => {
                        const numericValue = event.target.value.replace(/\D/g, "");
                        setFormData((previousData) => ({ ...previousData, capacity: numericValue }));
                        clearFieldError("capacity");
                      }}
                      error={Boolean(errors.capacity)}
                      helperText={errors.capacity || "Enter a positive whole number of team members."}
                      inputRef={(element) => { fieldRefs.current.capacity = element; }}
                      required
                    />
                  </Stack>
                </CardContent>
              </Card>
            )}

            {activeStep === 2 && (
              <Card sx={{ width: "100%", minWidth: 0, borderRadius: "16px" }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6">Review Your Project</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please review your project information before submission.
                      </Typography>
                    </Box>
                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Project Title</Typography>
                      <Typography sx={{ overflowWrap: "anywhere" }}>{formData.title}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Project Goal</Typography>
                      <Typography sx={{ overflowWrap: "anywhere" }}>{formData.goal}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{formData.description}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Required Skills</Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                        {skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Team Capacity</Typography>
                      <Typography>{formData.capacity} members</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 1.5,
                pt: 1,
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleBackStep}
                  disabled={activeStep === 0}
                  sx={{ whiteSpace: "nowrap", flex: { xs: 1, sm: "none" } }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenResetDialog}
                  sx={{ whiteSpace: "nowrap", flex: { xs: 1, sm: "none" } }}
                >
                  Reset
                </Button>
                <Button
                  component={Link}
                  to="/my-projects"
                  variant="text"
                  sx={{ whiteSpace: "nowrap", flex: { xs: 1, sm: "none" } }}
                >
                  Cancel
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitted}
                startIcon={activeStep === 2 ? <AddRoundedIcon /> : undefined}
                sx={{ px: 4, whiteSpace: "nowrap" }}
              >
                {isSubmitted ? "Submitting..." : activeStep === 2 ? "Submit Project" : "Next"}
              </Button>
            </Box>

            {message && !isSubmitted && (
              <Box
                role="status"
                sx={{
                  bgcolor: "rgba(232, 245, 237, 0.75)",
                  border: "1px solid rgba(46, 125, 80, 0.20)",
                  px: 2.5,
                  py: 2,
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Stack spacing={0.5}>
                  <Typography sx={{ color: "#17603D", fontWeight: 700, fontSize: 15 }}>
                    Could not create project
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#397354", lineHeight: 1.7 }}>
                    {message}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>

        <Card sx={{ display: { xs: "none", lg: "block" }, position: "sticky", top: 88, borderRadius: "16px" }} aria-label="Project preview">
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary">Preview</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, wordBreak: "break-word", color: formData.title ? "text.primary" : "text.disabled" }}>
              {formData.title || "Your project title"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, wordBreak: "break-word" }}>
              {formData.goal || "Your goal appears here"}
            </Typography>
            <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", mt: 2 }}>
              {String(formData.requiredSkills).split(",").map((x) => x.trim()).filter(Boolean).slice(0, 8).map((x) => (
                <Chip key={x} size="small" label={x} sx={{ bgcolor: "#F0F3F8", color: "#4B6382" }} />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Team capacity: {formData.capacity || "–"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              This is how people will see your project.
            </Typography>
          </CardContent>
        </Card>
        </Box>
      </Box>

      <Snackbar
        open={isSubmitted}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1, mr: { xs: 1, sm: 2 }, maxWidth: { xs: "calc(100% - 16px)", sm: 420 } }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={false}
          sx={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            alignItems: "center",
            borderRadius: "16px",
            bgcolor: "#218653",
            color: "#FFFFFF",
            boxShadow: "0 10px 30px rgba(7, 23, 57, 0.18)",
            pb: 2.2,
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Stack spacing={0.35}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              Project created successfully!
            </Typography>
            <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
              Taking you to My Projects...
            </Typography>
          </Stack>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: 4,
              bgcolor: "rgba(255,255,255,0.28)",
              "&::after": {
                content: '""',
                display: "block",
                height: "100%",
                width: "100%",
                bgcolor: "#FFFFFF",
                transformOrigin: "left center",
                animation: "toast-countdown 2s linear forwards",
              },
              "@keyframes toast-countdown": {
                from: { transform: "scaleX(1)" },
                to: { transform: "scaleX(0)" },
              },
            }}
          />
        </Alert>
      </Snackbar>

      {/* Unsaved changes dialog */}
      <Dialog
        open={blocker.state === "blocked"}
        onClose={handleStayOnPage}
        fullWidth
        maxWidth="xs"
        aria-labelledby="unsaved-changes-title"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.68)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.65)",
              borderRadius: "16px",
              boxShadow: "0 24px 70px rgba(7, 23, 57, 0.20)",
              mx: 2,
            },
          },
          backdrop: { sx: { backgroundColor: "rgba(7, 23, 57, 0.28)" } },
        }}
      >
        <DialogTitle id="unsaved-changes-title">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "rgba(227, 195, 157, 0.30)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <WarningAmberRoundedIcon sx={{ color: "#A68868", fontSize: 27 }} />
            </Box>
            <Typography component="span" sx={{ fontSize: 21, fontWeight: 800, color: "#071739" }}>
              Leave this page?
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: "#4B6382" }}>
            You have unsaved changes in your project form. If you leave this page, your information will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, flexWrap: "wrap", gap: 1 }}>
          <Button variant="outlined" onClick={handleStayOnPage}>Stay Here</Button>
          <Button variant="contained" onClick={handleLeavePage} sx={{ bgcolor: "#071739", "&:hover": { bgcolor: "#4B6382" } }}>
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset confirmation dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleCancelReset}
        fullWidth
        maxWidth="xs"
        aria-labelledby="reset-form-dialog-title"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.68)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.65)",
              borderRadius: "16px",
              boxShadow: "0 24px 70px rgba(7, 23, 57, 0.20)",
              mx: 2,
            },
          },
          backdrop: { sx: { backgroundColor: "rgba(7, 23, 57, 0.28)" } },
        }}
      >
        <DialogTitle id="reset-form-dialog-title" sx={{ fontWeight: 800, color: "#071739" }}>
          Reset Project Form?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#4B6382", fontSize: 14, lineHeight: 1.8 }}>
            All entered project details and selected skills will be cleared. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={handleCancelReset}>Keep Editing</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReset}>Reset Form</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CreateProject;
