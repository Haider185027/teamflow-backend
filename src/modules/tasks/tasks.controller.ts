import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema";
import { createTask, getProjectTasks, updateTask, deleteTask } from "./tasks.service";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const task = await createTask(req.userId!, parsed.data);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.query;

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ error: "projectId query param is required" });
    }

    const tasks = await getProjectTasks(req.userId!, projectId);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const task = await updateTask(req.userId!, req.params.id, parsed.data);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteTask(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
