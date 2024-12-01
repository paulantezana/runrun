import useAuthStore from "store/useAuthStore";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatSidebar = ({
  setSidebarOpen,
  onThreadClick,
  threadHooks
}) => {
  const { threads, createThread, deleteThread, currentThread, loading } = threadHooks;

  const onWrapperClose = (e) => {
    e.preventDefault();
    setSidebarOpen(false);
  };

  const onSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="chat-sidebar-wrapper" onClick={onWrapperClose}>
      <div className="chat-sidebar" onClick={onSidebar}>
        <div className="chat-sidebar-head"></div>
        <div className="chat-sidebar-content">
          <ul className="SnList thread">
            {threads.map((item, key) => (
              <li
                className={`thread-item ${currentThread?.id == item.id ? 'active' : ''}`}
                key={key}
                onClick={() => onThreadClick(item)}
              >
                <span>{item.title}</span>
                <button
                  className={`SnBtn sm icon ${loading == 'delete' ? 'loading' : ''}`}
                  onClick={() => deleteThread(item.id)}
                  disabled={loading == 'delete'}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-sidebar-foot">
          <div>
            <button
              className={`SnBtn block lg primary ${loading == 'create' ? 'loading' : ''}`}
              onClick={() => createThread("Hilo " + threads.length)}
              disabled={loading == 'create'}
            >
              Nuevo ilo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
