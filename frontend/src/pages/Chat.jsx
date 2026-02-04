import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        setSelectedUser={setSelectedUser}
        setConversation={setConversation}
      />
      <ChatWindow
        selectedUser={selectedUser}
        conversation={conversation}
      />
    </div>
  );
}
