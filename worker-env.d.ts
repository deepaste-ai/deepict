interface Env {
  DEEPICT_CONTAINER: DurableObjectNamespace<import("./src/cf-worker").DeepictContainer>;
}