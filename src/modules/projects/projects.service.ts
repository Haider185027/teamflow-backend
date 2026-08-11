import prisma from "../../config/prisma";
import { CreateProjectInput } from "./projects.schema";

async function verifyTeamAccess(userId: string, teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { organization: true },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: team.organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error("You do not have access to this team");
  }

  return team;
}

export async function createProject(userId: string, input: CreateProjectInput) {
  await verifyTeamAccess(userId, input.teamId);

  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      teamId: input.teamId,
    },
  });

  return project;
}

export async function getTeamProjects(userId: string, teamId: string) {
  await verifyTeamAccess(userId, teamId);

  const projects = await prisma.project.findMany({
    where: { teamId },
  });

  return projects;
}
