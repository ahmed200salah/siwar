// This is the internal representation of a message used by the application's components.
export interface Message {
  role: 'user' | 'assistant' | string;
  content: string;
}

// This represents the raw message structure as it is stored in the Supabase JSONB column.
// It has a 'type' field instead of a 'role' field.
export interface SupabaseMessage {
  type: 'human' | 'ai' | string;
  content: string;
  [key: string]: any; // Allows for other properties we don't use.
}

export interface ChatHistoryRecord {
  id: number;
  session_id: string;
  // The 'message' column from Supabase can contain a single raw SupabaseMessage object
  // or an array of them.
  message: SupabaseMessage | SupabaseMessage[];
}

export interface SessionDisplayInfo {
  id: string;
  name: string;
}
