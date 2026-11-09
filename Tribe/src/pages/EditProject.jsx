
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { Link, useNavigate, useParams } from "react-router";

import {
  getProjectById,
  updateProject,
} from "../services/mockProjectService";

function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    description: "",
    capacity: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const project = await getProjectById(projectId);

        if (!active) return;

        setFormData({
          title: project.title ?? "",
          goal: project.goal ?? "",
          description: project.description ?? "",
          capacity: String(project.capacity ?? ""),
        });

        setSkills(
          Array.isArray(project.requiredSkills)
            ? project.requiredSkills
            : []
        );
      } catch (error) {
        if (active) {
          setMessage(error.message || "Could not load project.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function addSkill() {
    const value = skillInput.trim();

    if (
      value &&
      !skills.some(
        (skill) => skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      setSkills((previous) => [...previous, value]);
    }

    setSkillInput("");
  }

  function handleSkillKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    }
  }

  function removeSkill(skillToRemove) {
    setSkills((previous) =>
      previous.filter((skill) => skill !== skillToRemove)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const finalSkills = [...skills];
    const pendingSkill = skillInput.trim();

    if (
      pendingSkill &&
      !finalSkills.some(
        (skill) => skill.toLowerCase() === pendingSkill.toLowerCase()
      )
    ) {
      finalSkills.push(pendingSkill);
    }

    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Project title is required.";
    }

    if (!formData.goal.trim()) {
      nextErrors.goal = "Project goal is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (finalSkills.length === 0) {
      nextErrors.requiredSkills = "Add at least one skill.";
    }

    const capacity = Number(formData.capacity);

    if (
      formData.capacity === "" ||
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      nextErrors.capacity = "Enter a positive whole number.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setMessage("");

    try {
      await updateProject(projectId, {
        ...formData,
        capacity,
        requiredSkills: finalSkills,
      });

      navigate("/my-projects", {
        state: { message: "Project updated successfully." },
      });
    } catch (error) {
      setMessage(error.message || "Could not update project.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (message && !formData.title && !loading) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{message}</Alert>
        <Button component={Link} to="/my-projects">
          Back to My Projects
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", minWidth: 0, px: { xs: 0, sm: 1 } }}>
      <Button
        component={Link}
        to="/my-projects"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 2.5, borderRadius: "8px", fontWeight: 600 }}
      >
        Back to My Projects
      </Button>

      <Stack spacing={1} sx={{ mb: 3 }}>
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
          Edit Project
        </Typography>
      </Stack>

      <Card
        sx={{
          borderRadius: "16px",
          border: "1px solid rgba(7, 23, 57, 0.08)",
          boxShadow: "0 8px 28px rgba(7, 23, 57, 0.05)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, "&:last-child": { pb: { xs: 3, sm: 4, md: 5 } } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack
              spacing={3}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                "& .MuiFormHelperText-root": { ml: 0.5 },
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#071739" }}>
                  Project Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your project information and team requirements.
                </Typography>
              </Stack>

              <TextField
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={Boolean(errors.title)}
                helperText={errors.title}
                required
                inputProps={{ maxLength: 80 }}
              />

              <TextField
                label="Project Goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                error={Boolean(errors.goal)}
                helperText={errors.goal}
                required
                inputProps={{ maxLength: 160 }}
              />

              <TextField
                label="Description"
                name="description"
                multiline
                minRows={4}
                value={formData.description}
                onChange={handleChange}
                error={Boolean(errors.description)}
                helperText={errors.description}
                required
                inputProps={{ maxLength: 1000 }}
              />

              <Box>
                <TextField
                  label="Required Skills"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={addSkill}
                  error={Boolean(errors.requiredSkills)}
                  helperText={
                    errors.requiredSkills ||
                    "Press Enter or comma to add a skill."
                  }
                />

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
                      sx={{
                        borderRadius: "8px",
                        bgcolor: "#F0F3F8",
                        color: "#4B6382",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <TextField
                label="Team Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                error={Boolean(errors.capacity)}
                helperText={errors.capacity}
                inputProps={{ min: 1, step: 1 }}
                required
              />

              {message && (
                <Alert severity="error">{message}</Alert>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
                sx={{ pt: 1 }}
              >
                <Button
                  component={Link}
                  to="/my-projects"
                  variant="outlined"
                  disabled={saving}
                  sx={{ borderRadius: "8px", px: 3, minHeight: 42 }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  disabled={saving}
                  sx={{
                    borderRadius: "8px",
                    px: 3,
                    minHeight: 42,
                    bgcolor: "#071739",
                    "&:hover": { bgcolor: "#142A50" },
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditProject;
