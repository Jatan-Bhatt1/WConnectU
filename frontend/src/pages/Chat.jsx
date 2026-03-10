import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    import("../sockets/socket").then((module) => {
      const socket = module.default;
      const handleUserUpdated = (updatedUser) => {
        if (selectedUser && selectedUser._id === updatedUser.userId) {
          setSelectedUser(prev => ({ ...prev, avatar: updatedUser.avatar, name: updatedUser.name }));
        }
      };
      socket.on("userUpdated", handleUserUpdated);

      return () => {
        socket.off("userUpdated", handleUserUpdated);
      };
    });
  }, [selectedUser]);

  const handleChatDeleted = () => {
    setSelectedUser(null);
    setConversation(null);
    setRefreshSidebar(prev => !prev);
  };

  const handleBackToSidebar = () => {
    setSelectedUser(null);
    setConversation(null);
  };

  // On mobile: show sidebar when no user selected, show chat when user selected
  const showSidebar = !isMobile || !selectedUser;
  const showChat = !isMobile || selectedUser;

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .chat-layout {
          display: flex;
          height: 100vh;
          width: 100%;
          max-width: 100vw;
          overflow: hidden;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
        }
        @media (max-width: 768px) {
          .chat-layout {
            flex-direction: column;
          }
        }
      `}</style>
      <div className="chat-layout">
        {/* Floating gradient orbs for premium feel */}
        <div style={{
          position: "absolute",
          top: "5%",
          left: "20%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(131,77,255,0.12) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "float 10s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,168,132,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 12s ease-in-out infinite reverse",
          pointerEvents: "none",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          top: "40%",
          right: "40%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,159,67,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0
        }} />

        {/* Main content */}
        {showSidebar && (
          <Sidebar
            setSelectedUser={setSelectedUser}
            setConversation={setConversation}
            activeConversation={conversation}
            refreshTrigger={refreshSidebar}
            isMobile={isMobile}
          />
        )}
        {showChat && (
          <ChatWindow
            selectedUser={selectedUser}
            conversation={conversation}
            onDeleteChat={handleChatDeleted}
            isMobile={isMobile}
            onBack={handleBackToSidebar}
          />
        )}
      </div>
    </>
  );
}
