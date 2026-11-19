import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

// One shared MongoDB connection (it also survives hot reloads in development)
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
const client = (globalForMongo._mongoClient ??= new MongoClient(
  required("MONGODB_URI"),
));
const db = client.db(process.env.DB_NAME || "equipment_rental");

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL,
  secret: required("BETTER_AUTH_SECRET"),
  trustedOrigins: [baseURL],
  database: mongodbAdapter(db, { client }),

  emailAndPassword: { enabled: true, minPasswordLength: 6 },

  // A provider is only switched on when both of its keys are set
  socialProviders: {
    ...(googleId && googleSecret
      ? { google: { clientId: googleId, clientSecret: googleSecret } }
      : {}),
    ...(githubId && githubSecret
      ? { github: { clientId: githubId, clientSecret: githubSecret } }
      : {}),
  },

  user: {
    additionalFields: {
      // input: false means the browser can never set these
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      requestedRole: { type: "string", required: false, defaultValue: "none" },
      roleRequestStatus: {
        type: "string",
        required: false,
        defaultValue: "none",
        input: false,
      },
      phone: { type: "string", required: false },
      address: { type: "string", required: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Runs for every new account (email or social)
        before: async (user) => {
          const requested = String(
            (user as { requestedRole?: unknown }).requestedRole ?? "",
          );
          const wantsUpgrade = requested === "owner" || requested === "admin";

          return {
            data: {
              ...user,
              role: "customer", // everyone starts as a customer
              requestedRole: wantsUpgrade ? requested : "none",
              roleRequestStatus: wantsUpgrade ? "pending" : "none",
            },
          };
        },
      },
    },
  },

  hooks: {
    // Password rule from the assignment: an uppercase and a lowercase letter
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password =
          (ctx.body as { password?: string } | undefined)?.password ?? "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must include an uppercase and a lowercase letter",
          });
        }
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
        // The token only identifies the user. The server reads the role from the database.
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});