export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateRegistration = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  profilePicture: File | null
): ValidationResult => {
  const nameRegex = /^[a-zA-Z\s]{3,}$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: "Please enter a valid name" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  // if (!profilePicture) {
  //   return { isValid: false, message: "Please upload a profile picture" };
  // }

  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true };
};
