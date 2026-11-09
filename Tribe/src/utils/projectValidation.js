
export function validateProjectStep(formData, step) {
  const errors = {};

  if (step === 0) {
    if (!formData.title.trim()) {
      errors.title = "Project title is required.";
    }

    if (!formData.goal.trim()) {
      errors.goal = "Project goal is required.";
    }

    if (!formData.description.trim()) {
      errors.description = "Project description is required.";
    }
  }

  if (step === 1) {
    if (!formData.requiredSkills.trim()) {
      errors.requiredSkills = "At least one skill is required.";
    }

    const capacity = Number(formData.capacity);

    if (formData.capacity === "") {
      errors.capacity = "Team capacity is required.";
    } else if (!Number.isInteger(capacity) || capacity <= 0) {
      errors.capacity = "Capacity must be a positive whole number.";
    }
  }

  return errors;
}

export function validateProject(formData) {
  return {
    ...validateProjectStep(formData, 0),
    ...validateProjectStep(formData, 1),
  };
}
