import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  organizationId: z.string().uuid("Invalid organization ID"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
