
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";

function ProjectCard({ project, onEdit, onClose, onRequests }) {
  const skills = Array.isArray(project.requiredSkills)
    ? project.requiredSkills
    : [];

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: { xs: 2, sm: 3 },
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-3px)" },
          boxShadow: "0 14px 38px rgba(7, 23, 57, 0.1)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          "&:last-child": {
            pb: { xs: 2, sm: 3 },
          },
        }}
      >
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          {/* PROJECT HEADER */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  overflowWrap: "anywhere",
                  fontSize: { xs: 17, sm: 20 },
                }}
              >
                {project.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflowWrap: "anywhere" }}
              >
                {project.goal}
              </Typography>
            </Box>

            <Chip
              label={project.status === "closed" ? "Closed" : "Open"}
              color={project.status === "closed" ? "default" : "success"}
              size="small"
              variant="outlined"
              sx={{ flexShrink: 0 }}
            />
          </Stack>

          {/* DESCRIPTION */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "anywhere",
              minHeight: { xs: "auto", sm: 60 },
              lineHeight: 1.7,
            }}
          >
            {project.description}
          </Typography>

          {/* SKILLS */}
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{
                  maxWidth: "100%",
                  bgcolor: "#F0F3F8",
                  color: "#4B6382",
                  "& .MuiChip-label": {
                    overflowWrap: "anywhere",
                  },
                }}
              />
            ))}
          </Stack>

          <Divider />

          {/* TEAM CAPACITY */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ color: "text.secondary", minWidth: 0 }}
          >
            <PeopleOutlineRoundedIcon fontSize="small" />

            <Typography
              variant="body2"
              sx={{ overflowWrap: "anywhere" }}
            >
              Team capacity: {project.capacity}
            </Typography>
          </Stack>

          {/* ACTION BUTTONS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ width: "100%" }}
          >
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit(project)}
              disabled={typeof onEdit !== "function"}
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              size="small"
              color="secondary"
              fullWidth
              startIcon={<PeopleOutlineRoundedIcon />}
              onClick={() => onRequests(project)}
              disabled={typeof onRequests !== "function"}
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Requests
            </Button>

            <Button
              variant="text"
              size="small"
              color="error"
              fullWidth
              startIcon={<LockOutlinedIcon />}
              onClick={() => onClose(project)}
              disabled={
                typeof onClose !== "function" ||
                project.status === "closed"
              }
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
