import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMessagesContext } from "@/contexts/MessagesContext";

export function PromptSuggestions() {
  const { handleSendMessage } = useMessagesContext();

  return (
    <ScrollArea className="w-full h-[100px] py-2" dir="rtl">
      <div className="flex flex-row gap-2 px-4">
        {/* Suggestions have been removed */}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
