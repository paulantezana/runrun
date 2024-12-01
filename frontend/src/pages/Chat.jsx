import { faBars, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import ChatSidebar from "shared/components/ChatSidebar/ChatSidebar";
import useThread from "shared/components/ChatSidebar/useThread";
import ComposerForm from "shared/components/ComposerForm";
import Message from "shared/components/Message/Message";
import useDeviceSize from "shared/hooks/useDeviceSize";
import messageService from "shared/services/messageService";
import useAuthStore from "store/useAuthStore";

const Chat = () => {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useDeviceSize();
  const [messages, setMessages] = useState([]); // Mensajes completos
  const [currentResponse, setCurrentResponse] = useState(""); // Respuesta parcial
  const threadHooks = useThread();
  const messagesEndRef = useRef(null);
  const [loadingChat, setLoadingChat] = useState(false);

  const shouldShowSidebar = !isMobile || sidebarOpen;
  const { currentThread, threads, createThread } = threadHooks;

  const handleThreadClick = (thread) => {
    threadHooks.setCurrentThread(thread);
    setMessages([]);
    setCurrentResponse("");
  };

  const handleInputChange = async (message) => {
    setLoadingChat(true);
    let threadId = currentThread?.id;
    if (!threadId) {
      const createResponse = await createThread('Hilo ' + threads.length);
      threadId = createResponse.id;
    }

    setCurrentResponse("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    let responseContent = "";
    await messageService.chat(
      {
        content: message,
        thread_id: threadId,
      },
      ({ v }) => {
        setCurrentResponse((prev) => {
          responseContent = prev + v;
          return responseContent;
        });
      }
    );

    console.log(responseContent, "FINAL_RESPUESTA");

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: responseContent },
    ]);
    setCurrentResponse("");
    setLoadingChat(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentResponse]);

  return (
    <div className="chat">
      {shouldShowSidebar && (
        <ChatSidebar
          threadHooks={threadHooks}
          setSidebarOpen={setSidebarOpen}
          onThreadClick={handleThreadClick}
        />
      )}
      <div className="chat-body">
        <div className="chat-head">
          <div>
            {isMobile && (
              <button className="SnBtn" onClick={() => setSidebarOpen(true)}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
          </div>
          <div>Aprende Base de datos</div>
          <div>
            <div className="SnAvatar"><div className="SnAvatar-text">{user?.name?.substring(0,2)}</div></div>
          </div>
        </div>
        <div className="chat-content">
          <div className="chat-content-messages">
            {messages.map((item, index) => (
              <Message
                key={index}
                markdownContent={item.content}
                role={item.role}
              />
            ))}
            {currentResponse && (
              <Message markdownContent={currentResponse} role={"assistant"} />
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-content-widget">
            <ComposerForm onChange={handleInputChange} loadingChat={loadingChat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
