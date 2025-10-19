import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
  getUser: baseProcedure
    .query(() => {
      return {
        id: 'user_123',
        name: 'John Doe',
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;