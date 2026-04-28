import bcrypt from "bcryptjs";

import { User } from "../models";
import { db } from "./";

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    id: _id.toString(),
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

// Esta función crea o verifica el usuario de OAuth
export const oAUthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { id: _id.toString(), name, email, role };
  }

  const newUser = new User({ email: oAuthEmail, name: oAuthName, password: "@", role: "client" });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;
  return { id: _id.toString(), name, email, role };
};

export const getNumberOfClients = async (): Promise<number> => {
  await db.connect();
  const numberOfClients = await User.find({ role: "client" }).count();
  await db.disconnect();

  return JSON.parse(JSON.stringify(numberOfClients));
};
