import { createTRPCRouter } from '@/trpc/init';
import prisma from '@/lib/db';
import { workflowsRouter } from '@/app/features/workflows/server/routers';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;