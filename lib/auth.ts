import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "@/lib/polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    plugins: [
            polar({
                client: polarClient,
                createCustomerOnSignUp: true,
                use: [
                    checkout({
                        products: [
                            {
                                productId: "d4d36117-61fd-4d35-ac4e-daa8cbdfad9f",
                                slug: "pro"
                            }
                        ],
                        successUrl: process.env.POLAR_SUCCESS_URL,
                        authenticatedUsersOnly: true
                    }),
                    portal()
                ],
            })
    ]
});
