import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";

// Emoji categories with popular emojis
const emojiCategories = {
  "😊 Smileys": [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊",
    "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋",
    "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐",
    "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌",
    "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧"
  ],
  "❤️ Hearts": [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"
  ],
  "👋 Gestures": [
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
    "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
    "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🙏"
  ],
  "🎉 Celebration": [
    "🎉", "🎊", "🎈", "🎁", "🎂", "🍰", "🧁", "🥳", "🪅", "🎆",
    "🎇", "✨", "🎄", "🎃", "🎗️", "🎟️", "🎫", "🏆", "🥇", "🏅"
  ],
  "🔥 Popular": [
    "🔥", "💯", "✅", "⭐", "🌟", "💫", "⚡", "💥", "💢", "💤",
    "💨", "💦", "🎵", "🎶", "🎤", "🎧", "📱", "💻", "🖥️", "⌨️"
  ],
  "🐱 Animals": [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
    "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅"
  ],
  "🍕 Food": [
    "🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳", "🧇",
    "🥞", "🧈", "🍞", "🥐", "🥨", "🧀", "🥗", "🍝", "🍜", "🍲"
  ],
  "⚽ Sports": [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
    "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🏹", "🎣"
  ]
};

export default function MessageInput({
  conversationId,
  receiverId,
  setMessages,
}) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("😊 Smileys");
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const inputRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const sendMessage = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setShowEmojiPicker(false);
    try {
      const { data } = await api.post("/api/chat/message", {
        conversationId,
        content: text,
      });

      socket.emit("sendMessage", {
        receiverId,
        message: data,
      });

      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "var(--header-bg)",
        borderTop: "1px solid var(--sidebar-border)",
        position: "relative",
      }}
    >
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          style={{
            position: "absolute",
            bottom: "70px",
            left: "20px",
            width: "340px",
            height: "380px",
            background: "var(--sidebar-bg)",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
            border: "1px solid var(--sidebar-border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUp 0.2s ease-out",
            zIndex: 1000,
          }}
        >
          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              borderBottom: "1px solid var(--sidebar-border)",
              padding: "8px 8px 0",
              gap: "4px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  background: activeCategory === category
                    ? "var(--primary-color)"
                    : "transparent",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  color: activeCategory === category
                    ? "white"
                    : "var(--text-color)",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  fontWeight: activeCategory === category ? "600" : "400",
                }}
              >
                {category.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Category Label */}
          <div
            style={{
              padding: "10px 14px 6px",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "var(--user-text)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {activeCategory}
          </div>

          {/* Emoji Grid */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 10px 10px",
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "4px",
              alignContent: "start",
            }}
          >
            {emojiCategories[activeCategory].map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  padding: "6px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--hover-bg)";
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Button */}
      <button
        ref={emojiButtonRef}
        onClick={toggleEmojiPicker}
        style={{
          background: showEmojiPicker ? "var(--hover-bg)" : "transparent",
          border: "none",
          fontSize: "1.4rem",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: showEmojiPicker ? "scale(1.1)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--hover-bg)";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          if (!showEmojiPicker) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
        title="Emojis"
      >
        😊
      </button>

      {/* Input Field */}
      <div style={{ flex: 1, position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: "25px",
            border: "none",
            outline: "none",
            background: "var(--input-bg)",
            color: "var(--text-color)",
            fontSize: "15px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.3s ease"
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1), 0 0 0 2px var(--primary-color)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)";
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>

      {/* Attachment Button */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.3rem",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--user-text)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--hover-bg)";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Attach Image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </button>

      {/* Send Button */}
      <button
        onClick={sendMessage}
        disabled={isSending || !text.trim()}
        style={{
          background: text.trim()
            ? "linear-gradient(135deg, var(--primary-color) 0%, #00d4aa 100%)"
            : "var(--hover-bg)",
          border: "none",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: text.trim() ? "pointer" : "default",
          transition: "all 0.3s ease",
          boxShadow: text.trim() ? "0 4px 15px rgba(0, 168, 132, 0.4)" : "none"
        }}
        onMouseEnter={(e) => {
          if (text.trim()) {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 168, 132, 0.5)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = text.trim() ? "0 4px 15px rgba(0, 168, 132, 0.4)" : "none";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: "rotate(-30deg)",
            transition: "transform 0.3s ease"
          }}
        >
          <path
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            fill={text.trim() ? "white" : "var(--user-text)"}
          />
        </svg>
      </button>
    </div>
  );
}
