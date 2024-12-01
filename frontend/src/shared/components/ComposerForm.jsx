import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { useState } = require("react");

const ComposerForm = ({ onChange, loadingChat }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(message);
    setMessage("");
  };

  return (
    <form className="SnForm" onSubmit={handleSubmit}>
      <div className="SnForm-item" style={{ marginBottom: '0' }}>
        <div className="SnControlGroup">
          <div className="SnControl-wrapper SnControlGroup-input">
            <i className="fas fa-id-card-alt SnControl-prefix"></i>
            <textarea
              className="SnForm-control lg SnControl"
              required
              disabled={loadingChat}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Envía un mensaje a RunRun"
            >
              {message}
            </textarea>
          </div>
          <div className="SnControlGroup-append">
            <button
              className={`SnBtn icon primary iconCenter lg ${loadingChat ? 'loading' : ''}`}
              type="submit"
              disabled={loadingChat}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ComposerForm;
