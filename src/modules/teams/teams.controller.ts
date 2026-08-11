import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createTeamSchema } from "./teams.schema";
import { createTeam, getOrganizationTeams } from "./teams.service";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createTeamSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const team = await createTeam(req.userId!, parsed.data);
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { organizationId } = req.query;

    if (!organizationId || typeof organizationId !== "string") {
      return res.status(400).json({ error: "organizationId query param is required" });
    }

    const teams = await getOrganizationTeams(req.userId!, organizationId);
    res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
}
