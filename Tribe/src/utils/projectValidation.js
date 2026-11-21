
export function validateProjectStep(formData, step) {
  const errors = {};

  if (step === 0) {
    if (!formData.title.trim()) {
      errors.title = "وارد کردن عنوان پروژه الزامی است.";
    }

    if (!formData.goal.trim()) {
      errors.goal = "وارد کردن هدف پروژه الزامی است.";
    }

    if (!formData.description.trim()) {
      errors.description = "وارد کردن توضیحات پروژه الزامی است.";
    }
  }

  if (step === 1) {
    if (!formData.requiredSkills.trim()) {
      errors.requiredSkills = "حداقل یک مهارت وارد کنید.";
    }

    const capacity = Number(formData.capacity);

    if (formData.capacity === "") {
      errors.capacity = "وارد کردن ظرفیت تیم الزامی است.";
    } else if (!Number.isInteger(capacity) || capacity <= 0) {
      errors.capacity = "ظرفیت تیم باید یک عدد صحیح بزرگ‌تر از صفر باشد.";
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
