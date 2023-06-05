import { prisma } from "../../utils/db.server";
import { Snowflake } from "@theinternetfolks/snowflake";

type Role = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createRole = async (
  role: Pick<Role, "name">,
  scopes: string[]
): Promise<Role> => {
  const { name } = role;
  return prisma.role.create({
    data: {
      id: Snowflake.generate().toString(),
      name: name.toLowerCase(),
      scopes,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const listRoles = async (skip: number): Promise<Role[] | null> => {
  return prisma.role.findMany({
    skip,
    take: 10,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
