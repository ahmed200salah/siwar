import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './services/supabase';
import type { ChatHistoryRecord, Message, SupabaseMessage, SessionDisplayInfo } from './types';
import SessionList from './components/SessionList';
import ConversationView from './components/ConversationView';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [messagesBySession, setMessagesBySession] = useState<Map<string, Message[]>>(new Map());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatHistories = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('n8n_chat_histories_siwar')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        setError(`Failed to fetch chat history: ${error.message}`);
        console.error(error);
        setLoading(false);
        return;
      }

      if (data) {
        const processedMessages = new Map<string, Message[]>();
        (data as ChatHistoryRecord[]).forEach(record => {
          if (!record.session_id || !record.message) {
            console.warn('Skipping record with no session_id or message field:', record);
            return;
          }

          if (!processedMessages.has(record.session_id)) {
            processedMessages.set(record.session_id, []);
          }

          const messagesFromRecord: SupabaseMessage[] = Array.isArray(record.message) 
            ? record.message 
            : [record.message];

          messagesFromRecord.forEach((msg: SupabaseMessage) => {
            if (msg && typeof msg.type === 'string' && typeof msg.content !== 'undefined') {
              const cleanMessage: Message = {
                role: msg.type.toLowerCase() === 'human' ? 'user' : 'assistant',
                content: String(msg.content),
              };
              processedMessages.get(record.session_id)?.push(cleanMessage);
            } else {
              console.warn('Skipping malformed message object (expecting `type` and `content`):', msg, 'in record:', record);
            }
          });
        });
        setMessagesBySession(processedMessages);
      }
      setLoading(false);
    };

    fetchChatHistories();
  }, []);

  const sessionDisplayData = useMemo(() => {
    return Array.from(messagesBySession.keys()).map((sessionId, index) => ({
      id: sessionId,
      name: `Customer ${index + 1}`,
    }));
  }, [messagesBySession]);
  
  const currentMessages = useMemo(() => {
    if (!selectedSession) return [];
    return messagesBySession.get(selectedSession) || [];
  }, [selectedSession, messagesBySession]);
  
  const selectedSessionDisplayName = useMemo(() => {
    if (!selectedSession) return null;
    const sessionInfo = sessionDisplayData.find(s => s.id === selectedSession);
    return sessionInfo ? sessionInfo.name : null;
  }, [selectedSession, sessionDisplayData]);


  const handleSelectSession = (sessionId: string) => {
    setSelectedSession(sessionId);
  };
  
  const SiwarLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  );

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-200 font-sans">
      <aside className="w-full md:w-1/4 lg:w-1/5 bg-slate-800/50 border-r border-slate-700/60 flex flex-col">
        <header className="p-4 border-b border-slate-700/60 flex items-center">
            <SiwarLogo />
            <h1 className="text-xl font-bold text-white tracking-wide">Siwar AI</h1>
        </header>
        <div className="flex-1 flex flex-col min-h-0">
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          {error && (
              <div className="p-4 m-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">
                  <p className="font-bold">An Error Occurred</p>
                  <p>{error}</p>
              </div>
          )}
          {!loading && !error && (
            <SessionList 
              sessions={sessionDisplayData} 
              selectedSession={selectedSession} 
              onSelectSession={handleSelectSession} 
            />
          )}
        </div>
        <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-700/60">
            Created by AI Orbit ❤️
        </footer>
      </aside>
      <main className="flex-1 flex flex-col">
        <ConversationView 
            messages={currentMessages} 
            sessionId={selectedSession}
            sessionDisplayName={selectedSessionDisplayName}
        />
      </main>
    </div>
  );
};

export default App;