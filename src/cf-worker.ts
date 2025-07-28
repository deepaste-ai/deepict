import { Container, getContainer } from "@cloudflare/containers";
import { Hono } from "hono";

export class DeepictContainer extends Container<Env> {
  // Port the Next.js server listens on
  defaultPort = 3000;
  // Time before container sleeps due to inactivity
  sleepAfter = "5m";
  // Environment variables passed to the container
  envVars = {
    NODE_ENV: "production",
    DEPLOYMENT_TARGET: "web",
    NEXT_TELEMETRY_DISABLED: "1",
    PORT: "3000",
    HOSTNAME: "0.0.0.0"
  };

  // Optional lifecycle hooks
  override onStart() {
    console.log("Deepict container successfully started");
  }

  override onStop() {
    console.log("Deepict container successfully shut down");
  }

  override onError(error: unknown) {
    console.log("Deepict container error:", error);
  }
}

// Create Hono app for routing
const app = new Hono<{
  Bindings: Env;
}>();

// Forward all requests to the container
app.all("/*", async (c) => {
  const container = getContainer(c.env.DEEPICT_CONTAINER, "deepict-instance");
  return await container.fetch(c.req.raw);
});

export default app;