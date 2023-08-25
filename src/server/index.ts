import { users } from "@/db/schema";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { eq } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await db.select().from(users).all();
  }),
  addUser: publicProcedure
    .input(z.string())
    .mutation(async ({ input: firstName }) => {
      await db.insert(users).values({ firstName }).run();

      return true;
    }),
  removeUser: publicProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      await db.delete(users).where(eq(users.id, id)).run();

      return true;
    }),
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
