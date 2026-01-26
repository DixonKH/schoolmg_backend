import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(6, "Full name must be at least 6 characters long"),
    parentName: z
      .string()
      .min(6, "Full name must be at least 6 characters long"),
    phone: z.string().min(9, "Phone number must be at least 9 characters long"),
    parentPhone: z
      .string()
      .min(9, "Phone number must be at least 9 characters long"),
    address: z.string().min(3, "Address must be at least 3 characters long"),
  }),
});

export const studentAverageSchema = z.object({
  query: z.object({
    studentId: z.string().uuid(),
    subjectId: z.string().uuid().optional(),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  }),
});
