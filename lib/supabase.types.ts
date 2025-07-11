// ~/Projects/movfoo/lib/supabase.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          media_type: 'movie' | 'tv';
          media_id: number;
          title: string;
          poster_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_type: 'movie' | 'tv';
          media_id: number;
          title: string;
          poster_path?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          poster_path?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'watchlist_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      // Add other tables here...
      // e.g. users, quiz_sessions, recipes, etc.
    };

    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

