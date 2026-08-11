import prisma from "../../config/prisma";
import { CreateTeamInput } from "./teams.schema";

export async function createTeam(userId: string, input: CreateTeamInput) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: input.organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this organization");
  }

  const team = await prisma.team.create({
    data: {
      name: input.name,
      organizationId: input.organizationId,
    },
  });

  return team;
}

export async function getOrganizationTeams(userId: string, organizationId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this organization");
  }

  const teams = await prisma.team.findMany({
    where: { organizationId },
  });

  return teams;
}
