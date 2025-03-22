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
  try {
    console.log("Starting sendMessage function...");
    let threadId = getCurrentThreadId();
    console.log("Current Thread ID:", threadId);

    if (!threadId) {
      console.log("Creating new thread...");
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      setCurrentThreadId(threadId);
      console.log("New Thread ID:", threadId);
    }

    console.log("Sending message to thread:", message);
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
    console.log("Message sent successfully");

    console.log("Creating run with assistant ID:", import.meta.env.VITE_OPENAI_ASSISTANT_ID);
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID,
      stream: true,
    });
    console.log("Run created successfully");

    let res = "";
    console.log("Starting to process run events...");
    for await (const event of run) {
      console.log("Received event:", event.event);
      if (event.event === "thread.message.delta") {
        const chunk = (event.data.delta.content?.[0] as any)?.text.value || "";
        console.log("Received chunk:", chunk);
        res += chunk;
        onChunk?.(chunk);
      }
    }
    console.log("Finished processing all events");

    return res;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
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
