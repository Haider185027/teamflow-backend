import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  teamId: z.string().uuid("Invalid team ID"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
