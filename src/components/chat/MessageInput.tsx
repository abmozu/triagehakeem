import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowUp } from "lucide-react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isPending: boolean;
}

export function MessageInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isPending,
}: MessageInputProps) {
  return (
    <div className="px-2 pb-6">
      <Card className="flex gap-2 max-w-4xl mx-auto p-4 rounded-3xl">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isPending}
          placeholder="قول لي من إيش تشتكي؟ ومن متى؟"
          className="min-h-[36px] max-h-[70px] h-auto resize-none flex-grow outline-none focus:ring-0 focus:outline-none shadow-none focus:border-0 active:border-0 focus-within:border-0 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 overflow-y-auto"
          onKeyDown={(e) => {
            const inMobileDevice = window.navigator.maxTouchPoints > 2;

            // if (e.key === "Enter" && !e.shiftKey && !isMobile) {
            //   e.preventDefault();
            //   handleSendMessage();
            // }
            if (e.key === "Enter" && !e.shiftKey && !inMobileDevice) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            // Reset height to auto first to get the correct scrollHeight
            target.style.height = "36px";
            // Set the height to the minimum between scrollHeight and 70px
            target.style.height = `${Math.min(
              Math.max(target.scrollHeight, 36),
              70
            )}px`;
          }}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={isPending || !inputMessage.trim()}
          className="shrink-0 h-[36px] flex items-center justify-center rounded-xl"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </Card>
    </div>
  );
}
