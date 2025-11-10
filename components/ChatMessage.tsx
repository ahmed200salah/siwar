import React from 'react';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';


interface ChatMessageProps {
  message: Message;
}

const UserIcon = () => (
    <div className="w-9 h-9 rounded-full bg-sky-500/80 flex items-center justify-center text-white flex-shrink-0 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const AssistantIcon = () => (
    <div className="w-9 h-9 rounded-full bg-slate-600/80 flex items-center justify-center text-white flex-shrink-0 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10zM4 17a1 1 0 001.447.894l4-2A1 1 0 0010 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 004 7v10z" />
        </svg>
    </div>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role?.toLowerCase() === 'user';

  // Custom styling for markdown elements to fit the dark theme.
  const markdownComponents = {
    a: (props: any) => (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
        {props.children}
      </a>
    ),
    p: ({node, ...props}: any) => <p className="mb-2 last:mb-0" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
    code: ({node, inline, className, children, ...props}: any) => {
        return !inline ? (
          <pre className="bg-slate-800/50 p-3 rounded-md my-2 overflow-x-auto">
            <code className={`text-white ${className || ''}`} {...props}>
              {children}
            </code>
          </pre>
        ) : (
          <code className="bg-slate-800/50 px-1.5 py-0.5 rounded text-amber-300" {...props}>
            {children}
          </code>
        )
    }
  };

  return (
    <div className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AssistantIcon />}
      <div
        className={`max-w-xl px-4 py-3 rounded-xl shadow-md text-sm leading-relaxed ${
          isUser
            ? 'bg-sky-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-200 rounded-bl-none'
        }`}
      >
        {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
            <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {message.content}
                </ReactMarkdown>
            </div>
        )}
      </div>
       {isUser && <UserIcon />}
    </div>
  );
};

export default ChatMessage;