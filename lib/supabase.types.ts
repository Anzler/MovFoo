export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      currently_watching: {
        Row: {
          created_at: string | null
          id: string
          streaming_service: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          streaming_service?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          streaming_service?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorite_searches: {
        Row: {
          created_at: string | null
          food_id: number | null
          food_name: string | null
          id: string
          movie_id: number | null
          movie_title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          food_id?: number | null
          food_name?: string | null
          id?: string
          movie_id?: number | null
          movie_title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          food_id?: number | null
          food_name?: string | null
          id?: string
          movie_id?: number | null
          movie_title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: number
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      foods: {
        Row: {
          created_at: string | null
          cuisine: string | null
          cuisines: Json | null
          description: string | null
          description_tags: Json | null
          diets: Json | null
          dishtypes: Json | null
          dishTypes: Json | null
          glutenfree: boolean | null
          glutenFree: boolean | null
          id: number
          image: string | null
          image_url: string | null
          meal_type: string | null
          mealType: string | null
          mood_tags: string[] | null
          moodTags: string[] | null
          name: string | null
          overview: string | null
          prep_time_minutes: number | null
          prepTimeMinutes: number | null
          readyinminutes: number | null
          readyInMinutes: number | null
          servings: number | null
          source_url: string | null
          sourceUrl: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          vegan: boolean | null
          vegetarian: boolean | null
        }
        Insert: {
          created_at?: string | null
          cuisine?: string | null
          cuisines?: Json | null
          description?: string | null
          description_tags?: Json | null
          diets?: Json | null
          dishtypes?: Json | null
          dishTypes?: Json | null
          glutenfree?: boolean | null
          glutenFree?: boolean | null
          id?: number
          image?: string | null
          image_url?: string | null
          meal_type?: string | null
          mealType?: string | null
          mood_tags?: string[] | null
          moodTags?: string[] | null
          name?: string | null
          overview?: string | null
          prep_time_minutes?: number | null
          prepTimeMinutes?: number | null
          readyinminutes?: number | null
          readyInMinutes?: number | null
          servings?: number | null
          source_url?: string | null
          sourceUrl?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          vegan?: boolean | null
          vegetarian?: boolean | null
        }
        Update: {
          created_at?: string | null
          cuisine?: string | null
          cuisines?: Json | null
          description?: string | null
          description_tags?: Json | null
          diets?: Json | null
          dishtypes?: Json | null
          dishTypes?: Json | null
          glutenfree?: boolean | null
          glutenFree?: boolean | null
          id?: number
          image?: string | null
          image_url?: string | null
          meal_type?: string | null
          mealType?: string | null
          mood_tags?: string[] | null
          moodTags?: string[] | null
          name?: string | null
          overview?: string | null
          prep_time_minutes?: number | null
          prepTimeMinutes?: number | null
          readyinminutes?: number | null
          readyInMinutes?: number | null
          servings?: number | null
          source_url?: string | null
          sourceUrl?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          vegan?: boolean | null
          vegetarian?: boolean | null
        }
        Relationships: []
      }
      genre_lookup: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      item_features: {
        Row: {
          feature_key: string
          feature_value: string
          id: number
          item_id: number
          item_type: string
        }
        Insert: {
          feature_key: string
          feature_value: string
          id?: number
          item_id: number
          item_type: string
        }
        Update: {
          feature_key?: string
          feature_value?: string
          id?: number
          item_id?: number
          item_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_features_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["feature_key"]
          },
        ]
      }
      movies: {
        Row: {
          adult: boolean | null
          audience: string | null
          based_on_true_story: boolean | null
          box_office: number | null
          created_at: string
          description: string | null
          description_tags: Json | null
          director: string | null
          genre: string | null
          genre_ids: Json | null
          genres: string[] | null
          id: number
          imdb_id: string | null
          lead_cast: string[] | null
          mood_tags: string[] | null
          original_language: string | null
          overview: string | null
          popularity: number | null
          poster_url: string | null
          rating: number | null
          release_date: string | null
          release_year: number | null
          revenue: number | null
          runtime_minutes: number | null
          source: string | null
          streaming: string | null
          streaming_platforms: string[] | null
          tags: string[] | null
          title: string | null
          tmdb_id: number | null
          tmdb_runtime: number | null
          vote_average: number | null
          vote_count: number | null
          year: number | null
        }
        Insert: {
          adult?: boolean | null
          audience?: string | null
          based_on_true_story?: boolean | null
          box_office?: number | null
          created_at?: string
          description?: string | null
          description_tags?: Json | null
          director?: string | null
          genre?: string | null
          genre_ids?: Json | null
          genres?: string[] | null
          id?: number
          imdb_id?: string | null
          lead_cast?: string[] | null
          mood_tags?: string[] | null
          original_language?: string | null
          overview?: string | null
          popularity?: number | null
          poster_url?: string | null
          rating?: number | null
          release_date?: string | null
          release_year?: number | null
          revenue?: number | null
          runtime_minutes?: number | null
          source?: string | null
          streaming?: string | null
          streaming_platforms?: string[] | null
          tags?: string[] | null
          title?: string | null
          tmdb_id?: number | null
          tmdb_runtime?: number | null
          vote_average?: number | null
          vote_count?: number | null
          year?: number | null
        }
        Update: {
          adult?: boolean | null
          audience?: string | null
          based_on_true_story?: boolean | null
          box_office?: number | null
          created_at?: string
          description?: string | null
          description_tags?: Json | null
          director?: string | null
          genre?: string | null
          genre_ids?: Json | null
          genres?: string[] | null
          id?: number
          imdb_id?: string | null
          lead_cast?: string[] | null
          mood_tags?: string[] | null
          original_language?: string | null
          overview?: string | null
          popularity?: number | null
          poster_url?: string | null
          rating?: number | null
          release_date?: string | null
          release_year?: number | null
          revenue?: number | null
          runtime_minutes?: number | null
          source?: string | null
          streaming?: string | null
          streaming_platforms?: string[] | null
          tags?: string[] | null
          title?: string | null
          tmdb_id?: number | null
          tmdb_runtime?: number | null
          vote_average?: number | null
          vote_count?: number | null
          year?: number | null
        }
        Relationships: []
      }
      next_quiz_question: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          order_index: number
          question_text: string
          target_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          order_index: number
          question_text: string
          target_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          order_index?: number
          question_text?: string
          target_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          answer: string
          answered_at: string | null
          feature_key: string
          id: number
          session_id: string
        }
        Insert: {
          answer: string
          answered_at?: string | null
          feature_key: string
          id?: number
          session_id: string
        }
        Update: {
          answer?: string
          answered_at?: string | null
          feature_key?: string
          id?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["feature_key"]
          },
        ]
      }
      quiz_progress: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          id: number
          quiz_id: number
          score: number | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: never
          quiz_id: number
          score?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: never
          quiz_id?: number
          score?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          feature_key: string
          id: number
          prompt: string
          sort_order: number
          weight: number
        }
        Insert: {
          feature_key: string
          id?: number
          prompt: string
          sort_order: number
          weight?: number
        }
        Update: {
          feature_key?: string
          id?: number
          prompt?: string
          sort_order?: number
          weight?: number
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          answers: Json | null
          created_at: string | null
          current_step: number | null
          food_results: Json | null
          id: string
          movie_results: Json | null
          quiz_type: string | null
          state: Json | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          created_at?: string | null
          current_step?: number | null
          food_results?: Json | null
          id?: string
          movie_results?: Json | null
          quiz_type?: string | null
          state?: Json | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          created_at?: string | null
          current_step?: number | null
          food_results?: Json | null
          id?: string
          movie_results?: Json | null
          quiz_type?: string | null
          state?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_pairs: {
        Row: {
          created_at: string | null
          food_name: string | null
          id: number
          movie_title: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          food_name?: string | null
          id?: number
          movie_title?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          food_name?: string | null
          id?: number
          movie_title?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          id: number
          search_name: string
          search_query: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          search_name: string
          search_query: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          search_name?: string
          search_query?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      streaming_availability: {
        Row: {
          link: string | null
          provider_id: number
          provider_name: string
          tmdb_id: number
        }
        Insert: {
          link?: string | null
          provider_id: number
          provider_name: string
          tmdb_id: number
        }
        Update: {
          link?: string | null
          provider_id?: number
          provider_name?: string
          tmdb_id?: number
        }
        Relationships: []
      }
      tv_shows: {
        Row: {
          audience: string | null
          based_on_true_story: boolean | null
          created_at: string | null
          description: string | null
          description_tags: Json | null
          director: string | null
          episodes: number | null
          first_air_date: string | null
          genre: string | null
          genre_ids: Json | null
          genres: string[] | null
          id: number
          imdb_id: string | null
          lead_cast: string[] | null
          mood_tags: string[] | null
          origin_country: Json | null
          original_language: string | null
          overview: string | null
          popularity: number | null
          poster_url: string | null
          rating: number | null
          release_year: number | null
          runtime_minutes: number | null
          seasons: number | null
          source: string | null
          streaming_platforms: string[] | null
          title: string | null
          tmdb_id: number | null
          vote_average: number | null
          vote_count: number | null
          year: number | null
        }
        Insert: {
          audience?: string | null
          based_on_true_story?: boolean | null
          created_at?: string | null
          description?: string | null
          description_tags?: Json | null
          director?: string | null
          episodes?: number | null
          first_air_date?: string | null
          genre?: string | null
          genre_ids?: Json | null
          genres?: string[] | null
          id: number
          imdb_id?: string | null
          lead_cast?: string[] | null
          mood_tags?: string[] | null
          origin_country?: Json | null
          original_language?: string | null
          overview?: string | null
          popularity?: number | null
          poster_url?: string | null
          rating?: number | null
          release_year?: number | null
          runtime_minutes?: number | null
          seasons?: number | null
          source?: string | null
          streaming_platforms?: string[] | null
          title?: string | null
          tmdb_id?: number | null
          vote_average?: number | null
          vote_count?: number | null
          year?: number | null
        }
        Update: {
          audience?: string | null
          based_on_true_story?: boolean | null
          created_at?: string | null
          description?: string | null
          description_tags?: Json | null
          director?: string | null
          episodes?: number | null
          first_air_date?: string | null
          genre?: string | null
          genre_ids?: Json | null
          genres?: string[] | null
          id?: number
          imdb_id?: string | null
          lead_cast?: string[] | null
          mood_tags?: string[] | null
          origin_country?: Json | null
          original_language?: string | null
          overview?: string | null
          popularity?: number | null
          poster_url?: string | null
          rating?: number | null
          release_year?: number | null
          runtime_minutes?: number | null
          seasons?: number | null
          source?: string | null
          streaming_platforms?: string[] | null
          title?: string | null
          tmdb_id?: number | null
          vote_average?: number | null
          vote_count?: number | null
          year?: number | null
        }
        Relationships: []
      }
      user_tags: {
        Row: {
          created_at: string | null
          id: string
          item_id: number
          item_type: string
          tag: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: number
          item_type: string
          tag: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: number
          item_type?: string
          tag?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_watch_progress: {
        Row: {
          id: string
          progress_pct: number | null
          status: string | null
          tmdb_id: number
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          progress_pct?: number | null
          status?: string | null
          tmdb_id: number
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          progress_pct?: number | null
          status?: string | null
          tmdb_id?: number
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string | null
          id: number
          movie_id: number | null
          poster_url: string | null
          service: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          movie_id?: number | null
          poster_url?: string | null
          service?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          movie_id?: number | null
          poster_url?: string | null
          service?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_movie_fk"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      yuck_list: {
        Row: {
          created_at: string | null
          id: string
          item: string | null
          item_id: string | null
          item_type: string | null
          session_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item?: string | null
          item_id?: string | null
          item_type?: string | null
          session_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item?: string | null
          item_id?: string | null
          item_type?: string | null
          session_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      content_view: {
        Row: {
          audience: string | null
          based_on_true_story: boolean | null
          genre: string | null
          id: number | null
          rating: number | null
          runtime_minutes: number | null
          title: string | null
          type: string | null
          year: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      fetch_runtime: {
        Args: { movie_id: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
