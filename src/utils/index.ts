import { ClassValue, clsx } from "clsx"; // Utility for conditional class names
import { twMerge } from "tailwind-merge"; // Utility to merge Tailwind classes

// Combine and merge class names using clsx and Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validate phone number format (XXX-XXX-XXXX or similar)
export function validatePhone(phone: string): boolean {
  const phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phone.match(phoneNum) ? true : false;
}

// Validate email format
export const validateEmail = (email: string): boolean => {
  return !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // Email regex
    );
};

// Validate if company name has at least 3 characters
export const validateCompanyName = (value?: string) =>
  !value || value.length >= 3;

// Validate website URL format
export const validateWebsite = (value?: string) => {
  const urlRegex = /^(https?:\/\/|ftp:\/\/)?[^\s/$.?#].[^\s]*$/i;
  return !value || urlRegex.test(value);
};

// Check if address is not empty
export const validateAddress = (value: string) => !!value;
