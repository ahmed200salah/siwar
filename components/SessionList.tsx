import React from 'react';
import type { SessionDisplayInfo } from '../types';
import { motion } from 'framer-motion';

interface SessionListProps {
  sessions: SessionDisplayInfo[];
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, selectedSession, onSelectSession }) => {
  if (sessions.length === 0) {
    return (
        <div className="flex-1 flex items-center justify-center p-4 text-center">
            <p className="text-slate-500">No active sessions found.</p>
        </div>
    );
  }
  
  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5 text-slate-400 group-hover:text-sky-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4m16 0l-4 4m4-4l-4-4" />
    </svg>
  );


  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
      <motion.nav
        className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
      {sessions.map((session) => (
        <motion.button
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          className={`group w-full flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ease-in-out truncate ${
            selectedSession === session.id
              ? 'bg-sky-600/30 text-white font-semibold border-l-4 border-sky-400'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }`}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChatIcon />
          {session.name}
        </motion.button>
      ))}
    </motion.nav>
    </>
  );
};

export default SessionList;