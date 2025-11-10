import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ConversationViewProps {
  messages: Message[];
  sessionId: string | null;
  sessionDisplayName: string | null;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ messages, sessionId, sessionDisplayName, onBack }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const SiwarLogoLarge = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  );

  if (!sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-lg bg-slate-900/50">
        <div className="text-center">
            <SiwarLogoLarge />
            <p className="mt-4 font-semibold text-slate-400">Welcome to Siwar AI Dashboard</p>
            <p className="text-sm text-slate-500">Select a session from the left to view the conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="p-4 border-b border-slate-700/60 bg-slate-800/20 flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="md:hidden p-1 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Back to sessions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-white truncate min-w-0">
          Conversation with <span className="text-sky-400 font-bold">{sessionDisplayName}</span>
        </h2>
      </header>
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-900/30">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
    </>
  );
};

export default ConversationView;
