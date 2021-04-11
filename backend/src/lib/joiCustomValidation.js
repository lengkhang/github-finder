export const parseToInteger = (value, helpers) => {
  const valueInInt = parseInt(value);

  if (valueInInt > 0) {
    return valueInInt;
  }

  return helpers.error("any.invalid");
};