import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Check, CheckCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday, isYesterday } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
  sender?: {
    name: string;
  };
}

interface Connection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  mentor?: { name: string };
  mentee?: { name: string };
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const connectionId = searchParams.get("connection");
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<Connection | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (connectionId && userId) {
      loadConnection();
      loadMessages();
    }
  }, [connectionId, userId]);

  useEffect(() => {
    if (!connectionId || !userId) return;

    const cleanup = subscribeToMessages();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionId, userId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
  };

  const loadConnection = async () => {
    const { data, error } = await supabase
      .from("connections")
      .select("*, mentor:profiles!connections_mentor_id_fkey(name), mentee:profiles!connections_mentee_id_fkey(name)")
      .eq("id", connectionId!)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to load connection",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setConnection(data);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("connection_id", connectionId!)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
      return;
    }

    // Load sender names separately
    const messagesWithSenders = await Promise.all((data || []).map(async (msg) => {
      const { data: sender } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", msg.sender_id)
        .single();
      return { ...msg, sender };
    }));

    setMessages(messagesWithSenders);
    
    // Mark messages as read
    if (userId && messagesWithSenders.length > 0) {
      const unreadMessages = messagesWithSenders.filter(
        (msg) => msg.sender_id !== userId && !msg.read
      );
      if (unreadMessages.length > 0) {
        await supabase
          .from("messages")
          .update({ read: true })
          .in("id", unreadMessages.map((m) => m.id));
      }
    }
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const subscribeToMessages = () => {
    if (!connectionId) return;

    const channel = supabase
      .channel(`messages:${connectionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `connection_id=eq.${connectionId}`,
        },
        async (payload) => {
          // Get the new message with sender info
          const newMessage = payload.new as Message;

          // Load sender name
          const { data: sender } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", newMessage.sender_id)
            .single();

          // Add message to state immediately (check for duplicates in setState)
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, { ...newMessage, sender }];
          });

          // Auto-scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);

          // Mark as read if it's not from current user
          if (newMessage.sender_id !== userId && !newMessage.read) {
            await supabase
              .from("messages")
              .update({ read: true })
              .eq("id", newMessage.id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `connection_id=eq.${connectionId}`,
        },
        (payload) => {
          // Update message in state
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to messages");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isSending || !userId) return;

    setIsSending(true);
    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    // Create optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content: messageContent,
      sender_id: userId,
      created_at: new Date().toISOString(),
      read: false,
      sender: { name: "You" }, // Will be replaced with actual sender name
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);

    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    // Send message to database
    const { data, error } = await supabase
      .from("messages")
      .insert({
        connection_id: connectionId!,
        sender_id: userId,
        content: messageContent,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      // Remove optimistic message and restore input
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(messageContent);
    } else {
      // Replace optimistic message with real one
      if (data) {
        const { data: sender } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", userId)
          .single();

        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempId
              ? { ...data, sender: sender || { name: "You" } }
              : msg
          )
        );
      }
    }

    setIsSending(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.created_at);
    const prevDate = new Date(prevMsg.created_at);
    return format(currentDate, "yyyy-MM-dd") !== format(prevDate, "yyyy-MM-dd");
  };

  const shouldGroupWithPrevious = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return false;
    return (
      currentMsg.sender_id === prevMsg.sender_id &&
      new Date(currentMsg.created_at).getTime() - new Date(prevMsg.created_at).getTime() < 300000 // 5 minutes
    );
  };

  const otherPersonName = connection
    ? connection.mentor_id === userId
      ? connection.mentee?.name
      : connection.mentor?.name
    : "";

  return (
    <div className="min-h-screen bg-[#e5ddd5] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgMTAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] p-4">
      <div className="container max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-2 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
          {/* Header */}
          <CardHeader className="border-b bg-[#075e54] text-white p-4">
            <CardTitle className="text-lg font-semibold text-white">
              {otherPersonName || "Chat"}
            </CardTitle>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden bg-[#ece5dd]">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-1">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const isMyMessage = message.sender_id === userId;
                    const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
                    const groupWithPrevious = shouldGroupWithPrevious(message, prevMessage);

                    return (
                      <div key={message.id}>
                        {showDateSeparator && (
                          <div className="flex items-center justify-center my-4">
                            <div className="bg-black/10 text-xs text-muted-foreground px-3 py-1 rounded-full">
                              {formatDateSeparator(message.created_at)}
                            </div>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            isMyMessage ? "justify-end" : "justify-start"
                          } ${groupWithPrevious ? "mt-0.5" : "mt-3"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                              isMyMessage
                                ? "bg-[#dcf8c6] rounded-tr-none"
                                : "bg-white rounded-tl-none"
                            }`}
                          >
                            {!groupWithPrevious && !isMyMessage && (
                              <p className="text-xs font-semibold text-[#128c7e] mb-1">
                                {message.sender?.name}
                              </p>
                            )}
                            <p className={`text-sm ${isMyMessage ? "text-gray-800" : "text-gray-900"} whitespace-pre-wrap break-words`}>
                              {message.content}
                            </p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${
                              isMyMessage ? "text-[#667781]" : "text-[#667781]"
                            }`}>
                              <span className="text-[10px]">
                                {formatMessageTime(message.created_at)}
                              </span>
                              {isMyMessage && (
                                <span className="ml-1">
                                  {message.read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <form
              onSubmit={sendMessage}
              className="p-3 border-t bg-white flex items-center gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border-gray-300 focus:border-[#128c7e] focus:ring-[#128c7e]"
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    sendMessage(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-[#128c7e] hover:bg-[#075e54] text-white"
                disabled={!newMessage.trim() || isSending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;