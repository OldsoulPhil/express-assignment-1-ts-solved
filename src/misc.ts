interface Body {
  age?: number;
  description?: string;
  breed?: string;
  name?: string;
}

export const attributesArray = [
  "age",
  "description",
  "breed",
  "name",
];

export const checkBodyKeys = (body: Body) => {
  const errors: string[] = [];
  for (const key of Object.keys(body)) {
    if (!attributesArray.includes(key)) {
      errors.push(`'${key}' is not a valid key`);
    }
  }
  return errors;
};

export const typeValidations = (
  errors: string[],
  body: Body
) => {
  const newErrors = [...errors];

  if (typeof body.age !== "number") {
    newErrors.push("age should be a number");
  }

  if (typeof body.description !== "string") {
    newErrors.push("description should be a string");
  }

  if (typeof body.name !== "string") {
    newErrors.push("name should be a string");
  }

  if (typeof body.breed !== "string") {
    newErrors.push("breed should be a string");
  }

  return newErrors;
};
