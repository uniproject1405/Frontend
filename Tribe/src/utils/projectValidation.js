
export function validateProjectStep(formData, step) {
  const errors = {};

  if (step === 0) {
    if (!formData.title.trim()) {
      errors.title = "عنوان پروژه الزامی است.";
    }

    if (!formData.goal.trim()) {
      errors.goal = "هدف پروژه الزامی است.";
    }

    if (!formData.description.trim()) {
      errors.description = "توضیحات پروژه الزامی است.";
    }
  }

  if (step === 1) {
    if (!formData.requiredSkills.trim()) {
      errors.requiredSkills = "حداقل یک مهارت لازم است.";
    }

    const capacity = Number(formData.capacity);

    if (formData.capacity === "") {
      errors.capacity = "ظرفیت تیم الزامی است.";
    } else if (!Number.isInteger(capacity) || capacity <= 0) {
      errors.capacity = "ظرفیت باید یک عدد صحیح مثبت باشد.";
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
