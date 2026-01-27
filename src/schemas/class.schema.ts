import {z} from "zod";

export const classAverageSchema = z.object({
    query: z.object({
        classId: z.string().uuid(),
        subjectId: z.string().uuid().optional(),
        from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
        to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
    })
});