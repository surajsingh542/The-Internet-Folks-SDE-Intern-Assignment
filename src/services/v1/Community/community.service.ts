import { prisma } from "../../../universe/v1/utils/db.server";
import { Snowflake } from "@theinternetfolks/snowflake";

type Community = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createCommunity = async (
  community: Pick<Community, "name" | "ownerId">
): Promise<Community> => {
  const { name, ownerId } = community;
  return prisma.community.create({
    data: {
      id: Snowflake.generate().toString(),
      name,
      slug: name.toLowerCase(),
      owner: { connect: { id: ownerId } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
