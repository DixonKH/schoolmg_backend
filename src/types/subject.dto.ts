import z from "zod";
import { subjectAverageSchema } from "../schemas/subject.schema";

export type SubjectAverageDTO = z.infer<typeof subjectAverageSchema>["query"];

export type SubjectAverageResponse = {
    subjectId: string;
    classId: string;
    averageScore: number;
    totalScore: number;
}