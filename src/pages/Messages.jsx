import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, MessageSquareText, Loader2 } from "lucide-react";
import ListingImage from "../components/ListingImage";
import EmptyState from "../components/EmptyState";
import { messagesApi } from "../api/misc";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/format";
import { useToast } from "../components/Toast";

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("c");
  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [thread, setThread] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const messagesContainerRef = useRef(null);

  const loadConversations = () => {
    setLoadingList(true);
    messagesApi
      .conversations()
      .then((data) => setConversations(data.items))
      .catch((err) => showToast(err.message, "warning"))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) {
      setThread([]);
      return;
    }
    setLoadingThread(true);
    messagesApi
      .thread(activeId)
      .then((data) => setThread(data.messages))
      .catch((err) => showToast(err.message, "warning"))
      .finally(() => setLoadingThread(false));
  }, [activeId]);

  // Scroll only the message list container to its bottom whenever the
  // thread updates — NOT the whole window. scrollIntoView() on a ref was
  // scrolling the entire page because the container had no bounded height,
  // so the container never actually got its own scrollbar; instead the
  // browser scrolled the whole document, which looked like the page
  // jumping to the top.
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [thread]);
 
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    setSending(true);
    try {
      const data = await messagesApi.send(activeId, text.trim());
      setThread((prev) => [...prev, data.message]);
      setText("");
      loadConversations();
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setSending(false);
    }
  };

  const activeConvo = conversations.find((c) => c.id === activeId);

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Messages</h1>

      <div className="grid gap-0 overflow-hidden rounded-card border border-paper-line md:grid-cols-[300px_1fr]">
        <div className="border-b border-paper-line bg-white md:border-b-0 md:border-r">
          <div className="max-h-[70vh] overflow-y-auto">
            {loadingList ? (
              <div className="flex items-center justify-center py-10 text-ink-faint">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={MessageSquareText}
                  title="No conversations yet"
                  message="Message a seller from a listing page to start chatting."
                />
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSearchParams({ c: c.id })}
                  className={`flex w-full items-center gap-3 border-b border-paper-line px-4 py-3 text-left hover:bg-paper ${
                    activeId === c.id ? "bg-bazaar-50" : ""
                  }`}
                >
                  {c.listing?.images?.[0] && (
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-tag bg-paper">
                      <ListingImage image={c.listing.images[0]} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{c.otherUser?.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {c.listing ? `${c.listing.brand} ${c.listing.model} • ` : ""}
                      {c.lastMessage}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-ink-faint">
                    {timeAgo(c.lastMessageAt)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Bounded height (h-[70vh], not min-h) so the flex-1 message
            list below actually has a fixed box to scroll within, instead
            of growing forever and pushing the whole page to scroll. */}
        <div className="flex h-[70vh] flex-col bg-paper">
          {!activeId ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <EmptyState
                icon={MessageSquareText}
                title="Select a conversation"
                message="Choose a chat on the left to see your messages."
              />
            </div>
          ) : (
            <>
              <div className="border-b border-paper-line bg-white px-4 py-3">
                <p className="font-bold text-ink">{activeConvo?.otherUser?.name}</p>
                {activeConvo?.listing && (
                  <p className="text-xs text-ink-faint">
                    Re: {activeConvo.listing.brand} {activeConvo.listing.model}
                  </p>
                )}
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 space-y-2.5 overflow-y-auto p-4 scrollbar-hide"
              >
                {loadingThread ? (
                  <div className="flex justify-center py-10 text-ink-faint">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                ) : (
                  thread.map((m) => {
                    const mine = m.sender === user?.id || m.sender?._id === user?.id;
                    return (
                      <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-tag px-3.5 py-2 text-sm ${
                            mine ? "bg-bazaar-500 text-white" : "bg-white text-ink border border-paper-line"
                          }`}
                        >
                          {m.text}
                          <div className={`mt-1 text-[10px] ${mine ? "text-bazaar-100" : "text-ink-faint"}`}>
                            {timeAgo(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2 border-t border-paper-line bg-white p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" disabled={sending || !text.trim()} className="btn-primary !px-3.5">
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              
            </>
          )}
        </div>
      </div>
    </div>
  );
}