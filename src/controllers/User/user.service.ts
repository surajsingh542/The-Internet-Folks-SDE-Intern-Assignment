import { prisma } from "../../utils/db.server";
import { Snowflake } from "@theinternetfolks/snowflake";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export const userSignUp = async (
  user: Pick<User, "name" | "email" | "password">
): Promise<User> => {
  const { name, email, password } = user;
  return prisma.user.create({
    data: {
      id: Snowflake.generate().toString(),
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

export const getUser = async (
  id: string
): Promise<Omit<User, "password"> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
