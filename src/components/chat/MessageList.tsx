import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import LoadingSpinner from "../custom/loading";
import { IMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MessageListProps {
  messages: IMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current && scrollAreaRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Scroll whenever messages change

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 px-4 pt-2 w-full max-w-4xl mx-auto"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
            className={`flex items-start gap-1 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar
              className={`h-8 w-8 ${msg.role === "user" ? "ml-2" : "mr-2"}`}
            >
              <AvatarImage
                src={
                  msg.role === "user"
                    ? "/user-avatar.png"
                    : "/assistant-avatar.png"
                }
                alt={msg.role === "user" ? "User" : "Assistant"}
              />
              <AvatarFallback
                className={
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>

            {msg.content === "" ? (
              <div className="pt-3">
                <LoadingSpinner />
              </div>
            ) : (
              <Card
                dir="rtl"
                className={`mt-2 max-w-[80%] rounded-3xl ${
                  msg.role === "user"
                    ? "bg-primary rounded-tr-none"
                    : "bg-secondary rounded-tl-none"
                }`}
              >
                <CardContent
                  className={`p-3 text-sm ${
                    msg.role === "user"
                      ? "text-primary-foreground"
                      : "text-secondary-foreground"
                  }`}
                >
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {msg.content}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
      <div className="h-5"> </div>
    </ScrollArea>
  );
}
