import { z } from "zod";

export const importJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  budget: z.number().optional().nullable(),
  hourlyRate: z.string().optional().nullable(),
  skills: z.array(z.string()).default([]),
  url: z.string().url("Must be a valid URL"),
});

export type ImportJobInput = z.infer<typeof importJobSchema>;
