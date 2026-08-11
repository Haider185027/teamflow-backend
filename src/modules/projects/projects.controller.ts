import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createProjectSchema } from "./projects.schema";
import { createProject, getTeamProjects } from "./projects.service";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const project = await createProject(req.userId!, parsed.data);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.query;

    if (!teamId || typeof teamId !== "string") {
      return res.status(400).json({ error: "teamId query param is required" });
    }

    const projects = await getTeamProjects(req.userId!, teamId);
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
}
