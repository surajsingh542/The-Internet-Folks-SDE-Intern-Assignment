import { prisma } from "../../../universe/v1/utils/db.server";
import { Snowflake } from "@theinternetfolks/snowflake";

type Member = {
  id: string;
  communityId: string;
  userId: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const addMember = async (
  member: Pick<Member, "communityId" | "userId" | "roleId">
): Promise<Member> => {
  const { communityId, userId, roleId } = member;
  return prisma.member.create({
    data: {
      id: Snowflake.generate().toString(),
      community: { connect: { id: communityId } },
      user: { connect: { id: userId } },
      role: { connect: { id: roleId } },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
