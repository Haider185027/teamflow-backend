import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createOrgSchema } from "./organizations.schema";
import { createOrganization, getUserOrganizations } from "./organizations.service";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createOrgSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const organization = await createOrganization(req.userId!, parsed.data);
    res.status(201).json(organization);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const organizations = await getUserOrganizations(req.userId!);
    res.status(200).json(organizations);
  } catch (err) {
    next(err);
  }
}
