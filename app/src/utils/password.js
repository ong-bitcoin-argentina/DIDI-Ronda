export const passwordChecker = (password, verifyPassword) => {
  const tPassword = password.trim();
  const tVerifyPassword = verifyPassword.trim();
  const minimumLength = 8;
  const numberRegex = new RegExp(".*[0-9].*");
  const upperCaseRegex = new RegExp(".*[A-Z].*");

  if (tPassword.length < minimumLength) return passwordErrors.MIN_LENGTH;
  if (tPassword !== tVerifyPassword) return passwordErrors.NO_MATCH;
  if (!upperCaseRegex.test(tPassword)) return passwordErrors.NO_MAYUS;
  if (!numberRegex.test(tPassword)) return passwordErrors.NO_NUMBER;
  return false;
};

export const passwordErrors = {
  MIN_LENGTH: "MIN_LENGTH",
  NO_MATCH: "NO_MATCH",
  CONTAINS_USER: "CONTAINS_USER",
  NO_MAYUS: "NO_MAYUS",
  NO_NUMBER: "NO_NUMBER",
};

export const passwordErrorsMessages = {
  [passwordErrors.MIN_LENGTH]: "La contraseña no tiene 8 caracteres o mas",
  [passwordErrors.NO_MATCH]: "Las contraseñas no coinciden",
  [passwordErrors.NO_MAYUS]: "La contraseña debe tener almenos 1 mayuscula",
  [passwordErrors.NO_NUMBER]: "La contraseña debe tener almenos 1 número",
};
