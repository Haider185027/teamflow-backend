import prisma from "../../config/prisma";
import { CreateTaskInput, UpdateTaskInput } from "./tasks.schema";
import { suggestTaskPriority } from "../ai/ai.service";

async function verifyProjectAccess(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { team: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: project.team.organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error("You do not have access to this project");
  }

  return project;
}

export async function createTask(userId: string, input: CreateTaskInput) {
  await verifyProjectAccess(userId, input.projectId);

  const priority = await suggestTaskPriority(input.title, input.description);

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      projectId: input.projectId,
      createdById: userId,
      assignedToId: input.assignedToId,
      priority: priority as "LOW" | "MEDIUM" | "HIGH",
    },
  });

  return task;
}

export async function getProjectTasks(userId: string, projectId: string) {
  await verifyProjectAccess(userId, projectId);

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return tasks;
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await verifyProjectAccess(userId, task.projectId);

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: input,
  });

  return updated;
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await verifyProjectAccess(userId, task.projectId);

  await prisma.task.delete({
    where: { id: taskId },
  });
}
