import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Para GitHub-flavored Markdown
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Importar el componente para resaltar código
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
// import hljs from "highlight.js"; // Importa highlight.js

const renderers = {
  code: (props) => {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    let language = 'plaintext'
    if(match){
      language = match[1];
    } else {
      // language = hljs.highlightAuto(children);
      // console.log(hljs.highlightAuto(children), 'YYYYYYYYYYYYYYYYYYYY');
    }
    console.log({language, children}, 'CODE');
    return (
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        children={String(children).replace(/\n$/, "")}
        language={language}
        style={okaidia}
      />
    );
  },
};

const Message = ({ markdownContent, role }) => {
  return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={ role == "assistant" ? ({ display: 'grid', gridTemplateColumns: '32px auto', columnGap: '1rem' }) : ({ display: 'flex', flexDirection: 'row-reverse' }) }>      
          <div>
            { role == "assistant" && <div className="SnAvatar"><div className="SnAvatar-text">AI</div></div> }
          </div>
          <div className="markdown-body" style={ role == "assistant" ? ({}) : ({ background: 'var(--panel-background-alt)', borderRadius: '.5rem', padding: '.625rem 1.25rem' }) } >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
    </div>
  );
};
export default Message;
