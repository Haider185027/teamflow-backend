import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import { registerUser, loginUser } from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const result = await registerUser(parsed.data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const result = await loginUser(parsed.data);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
