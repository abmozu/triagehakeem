import { createContext, useContext, useState, ReactNode } from "react";
import { useMessages } from "@/services/messages";
import { IMessage } from "@/types";

interface MessagesContextType {
  messages: IMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message?: string) => void;
  isPending: boolean;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children  }: { children: ReactNode }) {
  const { mutate: sendMessage, isPending } = useMessages();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (overrideMessage?: string) => {
    const messageToSend = overrideMessage || inputMessage;
    if (!messageToSend.trim()) return;

    const newUserMessage: IMessage = {
      role: "user",
      content: messageToSend,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    const placeholderAssistantMessage: IMessage = {
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, placeholderAssistantMessage]);

    let accumulatedResponse = "";

    sendMessage({
      message: messageToSend,
      onChunk: (chunk: string) => {
        accumulatedResponse += chunk;
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = accumulatedResponse;
          }
          return updatedMessages;
        });
      },
    });
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        inputMessage,
        setInputMessage,
        handleSendMessage,
        isPending,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessagesContext() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessagesContext must be used within a MessagesProvider");
  }
  return context;
} 