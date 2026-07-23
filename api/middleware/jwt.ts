import type { User } from "../generated/prisma/client.js";
import jwt from "jsonwebtoken";

interface resultToken {
  email: string;
  role: string;
  id: number;
}

export const generateToken = async (user: User): Promise<string> => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.APP_SECRET as string,
    {
      expiresIn: "1 days",
    },
  );

  return token;
};

export const getDetailToken = async (token: string): Promise<resultToken> => {
  const data = jwt.decode(token) as resultToken;

  return data;
};
