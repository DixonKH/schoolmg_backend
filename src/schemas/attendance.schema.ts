import {z} from "zod";

export const AttendanceQuerySchema = z.object({
    query: z.object({
        studentId: z.string().uuid().optional(),
        classId: z.string().uuid().optional(),
        subjectId: z.string().uuid().optional(),
        from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
        to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
    })
});
