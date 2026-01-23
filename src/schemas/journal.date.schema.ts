import z from "zod";

export const getAllJournalSchema = z.object({
  query: z
    .object({
      classId: z.string().uuid().optional(),
      subjectId: z.string().uuid().optional(),
      teacherId: z.string().uuid().optional(),

      fromDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .optional(),
      toDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.fromDate && data.toDate && data.fromDate > data.toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fromDate cannot be greater than toDate",
          path: ["fromDate"],
        });
      }
    }),
});
