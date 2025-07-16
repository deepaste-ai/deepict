import { EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";

export class SSEError extends Error {}

export class SSERetriableError extends SSEError {}

export class SSEFatalError extends SSEError {}

export function streamCallHTMLComponentGenerator(
  params: {
    prevHTML?: string;
    json: string;
    userInput?: string;
    apiKey?: string;
  },
  handlers: {
    onOpen: (response: Response) => Promise<void>;
    onMessage: (ev: EventSourceMessage) => void;
    onClose: () => void;
    onError: (err: unknown) => number | null | undefined | void;
  },
  signal?: AbortSignal,
) {
  return fetchEventSource("/fapi/gen-vis-comp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    signal,
    async onopen(response) {
      if (response.ok) {
        await handlers.onOpen(response);
      } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        // Handle API key errors
        if (response.status === 400) {
          const errorData = await response.json();
          throw new SSEFatalError(errorData.error || "API key configuration error");
        }
        throw new SSEFatalError();
      } else {
        throw new SSERetriableError();
      }
    },
    onmessage: handlers.onMessage,
    onclose: handlers.onClose,
    onerror: (err) => {
      handlers.onError(err);
      throw err;
    },
    openWhenHidden: true,
  });
}
