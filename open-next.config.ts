import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // OpenNext will use the Next.js config for build optimizations
  // The webpack optimizations in next.config.web.ts will be applied
});