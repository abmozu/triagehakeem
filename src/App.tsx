import Header from "./components/custom/header";
import { MessageList } from "./components/chat/MessageList";
import { MessageInput } from "./components/chat/MessageInput";
import {
  MessagesProvider,
  useMessagesContext,
} from "./contexts/MessagesContext";
import TypingAnimation from "./components/ui/typing-animation";
import { useLayoutEffect } from "react";
import { getCreateThreadId, getCurrentThreadId } from "./services/messages";

function ChatContainer() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    isPending,
  } = useMessagesContext();

  useLayoutEffect(() => {
    const threadID = getCurrentThreadId();
    if (!threadID) {
      getCreateThreadId();
    }
  }, []);

  return (
    <>
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <TypingAnimation className="text-2xl font-bold mb-4" delay={0}>
            حكيم ممرضك الشخصي
          </TypingAnimation>
          <TypingAnimation className="text-gray-600" delay={1000}>
            اسألني من إيش تشتكي وراح أقول لك وين تتوجه
          </TypingAnimation>
        </div>
      )}
      <MessageList messages={messages} />
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={() => handleSendMessage()}
        isPending={isPending}
      />
    </>
  );
}

function App() {
  return (
    <div className="flex justify-center h-dvh bg-gray-50">
      <div className="flex flex-col w-full max-w-4xl lg:w-4xl lg:px-8 h-full">
        <div>
          <Header />
        </div>
        <MessagesProvider>
          <ChatContainer />
        </MessagesProvider>
      </div>
    </div>
  );
}

export default App;
