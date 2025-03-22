import openai from "./openai-client";
import { useMutation } from "@tanstack/react-query";
const THREAD_ID_KEY = "openai_thread_id";

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    clearCurrentThreadId();
  });
}

export const getCurrentThreadId = (): string | null => {
  return localStorage.getItem(THREAD_ID_KEY);
};

export const setCurrentThreadId = (threadId: string): void => {
  localStorage.setItem(THREAD_ID_KEY, threadId);
};

export const clearCurrentThreadId = (): void => {
  localStorage.removeItem(THREAD_ID_KEY);
};

export async function getCreateThreadId() {
  const thread = await openai.beta.threads.create();
  setCurrentThreadId(thread.id);
}

const sendMessage = async (
  message: string,
  onChunk?: (chunk: string) => void
) => {
  let threadId = getCurrentThreadId();

  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
    setCurrentThreadId(threadId);
  }
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID,
    stream: true,
  });

  let res = "";
  for await (const event of run) {
    if (event.event === "thread.message.delta") {
      const chunk = (event.data.delta.content?.[0] as any)?.text.value || "";
      res += chunk;
      onChunk?.(chunk);
    }
  }

  return res;
};

interface SendMessageParams {
  message: string;
  onChunk: (chunk: string) => void;
}

export const useMessages = () => {
  return useMutation({
    mutationKey: ["messages"],
    mutationFn: (params: SendMessageParams) =>
      sendMessage(params.message, params.onChunk),
  });
};
