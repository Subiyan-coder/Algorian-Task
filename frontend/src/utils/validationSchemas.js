import { z } from 'zod';

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(
    /^[a-zA-Z\s]+$/,
    'Name must not contain numbers or special characters'
  );

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .trim()
  .email('Please enter a valid email address');

const contactSchema = z
  .string()
  .trim()
  .regex(
    /^[0-9]{10}$/,
    'Contact must be exactly 10 digits'
  );

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

const otpSchema = z
  .string()
  .trim()
  .regex(
    /^\d{6}$/,
    'OTP must be exactly 6 digits'
  );


  export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  contact: contactSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const verifyOtpSchema = z.object({
  otp: otpSchema
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,

  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema
});

export const updateProfileSchema = z.object({
    name: nameSchema,
    contact: contactSchema
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,()-]+$/, 'Title must not contain special characters'),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),

  assignedTo: z
    .string()
    .min(1, 'Please select someone to assign this task to')
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s.,()-]+$/, 'Title must not contain special characters')
    .optional(),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),

  status: z
    .enum(['pending', 'in-progress', 'completed', 'unable-to-complete'])
    .optional(),

  remarks: z
    .string()
    .max(300, 'Remarks must not exceed 300 characters')
    .optional()
});

export const getZodErrors = (zodError) => {
  const errors = {};
  zodError.issues.forEach((issue) => {
    const field = issue.path[0];
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  });
  return errors;
};