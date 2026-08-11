import prisma from "../../config/prisma";
import { CreateOrgInput } from "./organizations.schema";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createOrganization(userId: string, input: CreateOrgInput) {
  const baseSlug = slugify(input.name);
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

  const organization = await prisma.organization.create({
    data: {
      name: input.name,
      slug: uniqueSlug,
      memberships: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  return organization;
}

export async function getUserOrganizations(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { organization: true },
  });

  return memberships.map((m) => ({
    ...m.organization,
    role: m.role,
  }));
}
