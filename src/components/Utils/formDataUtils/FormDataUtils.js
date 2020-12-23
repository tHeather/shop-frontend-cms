export const MakeFormData = (object) => {
  const formData = new FormData();

  for (const property in object) {
    formData.append(property, object[property]);
  }
  return formData;
};
