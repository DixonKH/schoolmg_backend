import { z } from "zod";

export const scheduleSchema = z.object({
   body: z.object({
     dayOfWeek: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    room: z
      .string()
      .regex(/^[A-Z]\d{3}|\d{3}$/, "Room must be in 102 or A102 format"),
    subjectId: z.string().uuid(),
    teacherId: z.string().uuid(),
    classId: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["startTime"],
      });
    }
   })
  });
