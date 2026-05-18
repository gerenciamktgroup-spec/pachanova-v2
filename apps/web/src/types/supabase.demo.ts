// ─────────────────────────────────────────────────────────────
//  PachaNova · Supabase Types — proyecto: pachanova-demo
//  Auto-generado desde: supabase gen types typescript
//  Proyecto ID: cndppfspgqomgwixlfkw | Región: sa-east-1
//  ⚠️  NO EDITAR MANUALMENTE. Regenerar con: supabase gen types
// ─────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      annual_valuations: {
        Row: {
          confirmed_by_fideicomiso: boolean
          created_at: string
          id: string
          is_demo: boolean
          price_per_sqm: number
          price_per_token: number
          property_id: string | null
          source: string
          total_valuation_usd: number | null
          year: number
        }
        Insert: {
          confirmed_by_fideicomiso?: boolean
          created_at?: string
          id?: string
          is_demo?: boolean
          price_per_sqm: number
          price_per_token: number
          property_id?: string | null
          source: string
          total_valuation_usd?: number | null
          year: number
        }
        Update: {
          confirmed_by_fideicomiso?: boolean
          created_at?: string
          id?: string
          is_demo?: boolean
          price_per_sqm?: number
          price_per_token?: number
          property_id?: string | null
          source?: string
          total_valuation_usd?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "annual_valuations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          is_demo: boolean
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_demo?: boolean
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_demo?: boolean
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      balances: {
        Row: {
          available_tokens: number
          available_usd: number
          id: string
          investor_id: string
          last_updated_at: string
          locked_tokens: number
          locked_usd: number
          reserved_tokens: number
          total_distributions_received: number
          total_invested_usd: number
        }
        Insert: {
          available_tokens?: number
          available_usd?: number
          id?: string
          investor_id: string
          last_updated_at?: string
          locked_tokens?: number
          locked_usd?: number
          reserved_tokens?: number
          total_distributions_received?: number
          total_invested_usd?: number
        }
        Update: {
          available_tokens?: number
          available_usd?: number
          id?: string
          investor_id?: string
          last_updated_at?: string
          locked_tokens?: number
          locked_usd?: number
          reserved_tokens?: number
          total_distributions_received?: number
          total_invested_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "balances_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: true
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          events_log: Json | null
          id: string
          investor_email: string | null
          investor_name: string | null
          is_active: boolean
          presenter_id: string | null
          scenario: string | null
          session_token: string
          started_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          events_log?: Json | null
          id?: string
          investor_email?: string | null
          investor_name?: string | null
          is_active?: boolean
          presenter_id?: string | null
          scenario?: string | null
          session_token: string
          started_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          events_log?: Json | null
          id?: string
          investor_email?: string | null
          investor_name?: string | null
          is_active?: boolean
          presenter_id?: string | null
          scenario?: string | null
          session_token?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_sessions_presenter_id_fkey"
            columns: ["presenter_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      distributions: {
        Row: {
          amount_usd: number
          created_at: string
          id: string
          investor_id: string
          is_demo: boolean
          paid_at: string | null
          period_month: number | null
          period_year: number
          property_id: string
          status: Database["public"]["Enums"]["transaction_status_enum"]
          tokens_held: number
          tx_hash: string | null
          yield_pct: number | null
        }
        Insert: {
          amount_usd: number
          created_at?: string
          id?: string
          investor_id: string
          is_demo?: boolean
          paid_at?: string | null
          period_month?: number | null
          period_year: number
          property_id: string
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          tokens_held: number
          tx_hash?: string | null
          yield_pct?: number | null
        }
        Update: {
          amount_usd?: number
          created_at?: string
          id?: string
          investor_id?: string
          is_demo?: boolean
          paid_at?: string | null
          period_month?: number | null
          period_year?: number
          property_id?: string
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          tokens_held?: number
          tx_hash?: string | null
          yield_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "distributions_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      fideicomiso_operations: {
        Row: {
          created_at: string
          created_by: string
          current_signatures: number
          executed_at: string | null
          id: string
          is_demo: boolean
          notario_hash: string | null
          property_id: string | null
          required_signatures: number
          status: string
          sunarp_hash: string | null
          token_amount: number | null
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_signatures?: number
          executed_at?: string | null
          id?: string
          is_demo?: boolean
          notario_hash?: string | null
          property_id?: string | null
          required_signatures?: number
          status?: string
          sunarp_hash?: string | null
          token_amount?: number | null
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_signatures?: number
          executed_at?: string | null
          id?: string
          is_demo?: boolean
          notario_hash?: string | null
          property_id?: string | null
          required_signatures?: number
          status?: string
          sunarp_hash?: string | null
          token_amount?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fideicomiso_operations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fideicomiso_operations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      fideicomiso_signatures: {
        Row: {
          created_at: string
          id: string
          operation_id: string
          signature_hash: string | null
          signer_id: string
          signer_role: string
        }
        Insert: {
          created_at?: string
          id?: string
          operation_id: string
          signature_hash?: string | null
          signer_id: string
          signer_role: string
        }
        Update: {
          created_at?: string
          id?: string
          operation_id?: string
          signature_hash?: string | null
          signer_id?: string
          signer_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "fideicomiso_signatures_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "fideicomiso_operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fideicomiso_signatures_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          is_demo: boolean
          payload: Json
          processed_at: string | null
          provider: string
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          is_demo?: boolean
          payload?: Json
          processed_at?: string | null
          provider: string
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          is_demo?: boolean
          payload?: Json
          processed_at?: string | null
          provider?: string
          status?: string
        }
        Relationships: []
      }
      investors: {
        Row: {
          country: string | null
          created_at: string
          document_number: string | null
          document_type: string | null
          email: string
          first_name: string
          id: string
          is_accredited: boolean
          is_demo: boolean
          is_verified: boolean
          kyc_status: Database["public"]["Enums"]["kyc_status_enum"]
          last_name: string
          metadata: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role_enum"]
          supabase_auth_id: string | null
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          email: string
          first_name: string
          id?: string
          is_accredited?: boolean
          is_demo?: boolean
          is_verified?: boolean
          kyc_status?: Database["public"]["Enums"]["kyc_status_enum"]
          last_name: string
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          supabase_auth_id?: string | null
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          email?: string
          first_name?: string
          id?: string
          is_accredited?: boolean
          is_demo?: boolean
          is_verified?: boolean
          kyc_status?: Database["public"]["Enums"]["kyc_status_enum"]
          last_name?: string
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          supabase_auth_id?: string | null
          updated_at?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_type: string
          expires_at: string | null
          file_hash: string | null
          file_url: string | null
          id: string
          investor_id: string
          is_demo: boolean
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["kyc_status_enum"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_type: string
          expires_at?: string | null
          file_hash?: string | null
          file_url?: string | null
          id?: string
          investor_id: string
          is_demo?: boolean
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["kyc_status_enum"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_type?: string
          expires_at?: string | null
          file_hash?: string | null
          file_url?: string | null
          id?: string
          investor_id?: string
          is_demo?: boolean
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["kyc_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string
          id: string
          investor_id: string
          is_demo: boolean
          is_read: boolean
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type_enum"]
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          investor_id: string
          is_demo?: boolean
          is_read?: boolean
          metadata?: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type_enum"]
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          investor_id?: string
          is_demo?: boolean
          is_read?: boolean
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      p2p_orders: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_demo: boolean
          price_per_token: number
          property_id: string | null
          quantity: number
          seller_investor_id: string
          status: Database["public"]["Enums"]["p2p_status_enum"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_demo?: boolean
          price_per_token: number
          property_id?: string | null
          quantity: number
          seller_investor_id: string
          status?: Database["public"]["Enums"]["p2p_status_enum"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_demo?: boolean
          price_per_token?: number
          property_id?: string | null
          quantity?: number
          seller_investor_id?: string
          status?: Database["public"]["Enums"]["p2p_status_enum"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "p2p_orders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p2p_orders_seller_investor_id_fkey"
            columns: ["seller_investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      p2p_trades: {
        Row: {
          buyer_investor_id: string
          created_at: string
          fee_amount: number | null
          id: string
          is_demo: boolean
          order_id: string
          price_per_token: number
          property_id: string | null
          quantity: number
          seller_investor_id: string
          total_amount: number
          tx_hash: string | null
        }
        Insert: {
          buyer_investor_id: string
          created_at?: string
          fee_amount?: number | null
          id?: string
          is_demo?: boolean
          order_id: string
          price_per_token: number
          property_id?: string | null
          quantity: number
          seller_investor_id: string
          total_amount: number
          tx_hash?: string | null
        }
        Update: {
          buyer_investor_id?: string
          created_at?: string
          fee_amount?: number | null
          id?: string
          is_demo?: boolean
          order_id?: string
          price_per_token?: number
          property_id?: string | null
          quantity?: number
          seller_investor_id?: string
          total_amount?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "p2p_trades_buyer_investor_id_fkey"
            columns: ["buyer_investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p2p_trades_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "p2p_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p2p_trades_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p2p_trades_seller_investor_id_fkey"
            columns: ["seller_investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          annual_yield_pct: number | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          district: string | null
          documents: Json | null
          fideicomiso_id: string | null
          id: string
          images: Json | null
          is_demo: boolean
          metadata: Json | null
          name: string
          property_type: string | null
          status: Database["public"]["Enums"]["property_status_enum"]
          sunarp_registry: string | null
          token_price_usd: number
          tokens_reserved: number
          tokens_sold: number
          total_area_sqm: number | null
          total_tokens: number
          total_valuation_usd: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          annual_yield_pct?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          documents?: Json | null
          fideicomiso_id?: string | null
          id?: string
          images?: Json | null
          is_demo?: boolean
          metadata?: Json | null
          name: string
          property_type?: string | null
          status?: Database["public"]["Enums"]["property_status_enum"]
          sunarp_registry?: string | null
          token_price_usd?: number
          tokens_reserved?: number
          tokens_sold?: number
          total_area_sqm?: number | null
          total_tokens: number
          total_valuation_usd: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          annual_yield_pct?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          documents?: Json | null
          fideicomiso_id?: string | null
          id?: string
          images?: Json | null
          is_demo?: boolean
          metadata?: Json | null
          name?: string
          property_type?: string | null
          status?: Database["public"]["Enums"]["property_status_enum"]
          sunarp_registry?: string | null
          token_price_usd?: number
          tokens_reserved?: number
          tokens_sold?: number
          total_area_sqm?: number | null
          total_tokens?: number
          total_valuation_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      system_parameters: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      token_ledger: {
        Row: {
          amount: number
          created_at: string
          current_hash: string
          id: string
          investor_id: string | null
          is_demo: boolean
          operation: string
          previous_hash: string
          property_id: string | null
          tx_hash: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          current_hash: string
          id?: string
          investor_id?: string | null
          is_demo?: boolean
          operation: string
          previous_hash: string
          property_id?: string | null
          tx_hash?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          current_hash?: string
          id?: string
          investor_id?: string | null
          is_demo?: boolean
          operation?: string
          previous_hash?: string
          property_id?: string | null
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_ledger_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_ledger_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      token_orders: {
        Row: {
          created_at: string
          currency: string
          external_reference: string | null
          id: string
          investor_id: string
          is_demo: boolean
          metadata: Json | null
          mp_payment_id: string | null
          preference_id: string | null
          property_id: string | null
          quantity: number
          status: Database["public"]["Enums"]["transaction_status_enum"]
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          external_reference?: string | null
          id?: string
          investor_id: string
          is_demo?: boolean
          metadata?: Json | null
          mp_payment_id?: string | null
          preference_id?: string | null
          property_id?: string | null
          quantity: number
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          external_reference?: string | null
          id?: string
          investor_id?: string
          is_demo?: boolean
          metadata?: Json | null
          mp_payment_id?: string | null
          preference_id?: string | null
          property_id?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_orders_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_orders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          fee_amount: number | null
          id: string
          is_demo: boolean
          metadata: Json | null
          payment_provider: string | null
          payment_reference: string | null
          property_id: string | null
          receiver_id: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["transaction_status_enum"]
          tx_hash: string | null
          type: Database["public"]["Enums"]["transaction_type_enum"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          fee_amount?: number | null
          id?: string
          is_demo?: boolean
          metadata?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          property_id?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          tx_hash?: string | null
          type: Database["public"]["Enums"]["transaction_type_enum"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          fee_amount?: number | null
          id?: string
          is_demo?: boolean
          metadata?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          property_id?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          tx_hash?: string | null
          type?: Database["public"]["Enums"]["transaction_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buy_tokens: {
        Args: {
          p_property_id: string
          p_quantity: number
          p_unit_price: number
        }
        Returns: Json
      }
      current_investor_id: { Args: never; Returns: string }
      demo_buy_tokens: {
        Args: {
          p_investor_id: string
          p_property_id: string
          p_quantity: number
          p_unit_price: number
        }
        Returns: Json
      }
      deposit_demo_funds: { Args: { p_amount: number }; Returns: Json }
      get_demo_investor_profile: {
        Args: { p_investor_id: string }
        Returns: Json
      }
      get_my_investor_id: { Args: never; Returns: string }
      get_my_investor_role: { Args: never; Returns: string }
    }
    Enums: {
      kyc_status_enum:
        | "pending"
        | "in_review"
        | "approved"
        | "rejected"
        | "expired"
      notification_type_enum:
        | "kyc_update"
        | "payment_received"
        | "token_minted"
        | "distribution_paid"
        | "p2p_match"
        | "system_alert"
        | "demo_event"
      p2p_status_enum:
        | "open"
        | "reserved"
        | "completed"
        | "cancelled"
        | "expired"
      property_status_enum:
        | "draft"
        | "active"
        | "fully_tokenized"
        | "closed"
        | "liquidated"
      transaction_status_enum:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
        | "refunded"
      transaction_type_enum:
        | "deposit"
        | "withdrawal"
        | "transfer"
        | "mint"
        | "burn"
        | "p2p_buy"
        | "p2p_sell"
        | "distribution"
        | "fee"
      user_role_enum: "investor" | "admin" | "operator" | "viewer"
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
    Enums: {
      kyc_status_enum: ["pending", "in_review", "approved", "rejected", "expired"],
      notification_type_enum: ["kyc_update", "payment_received", "token_minted", "distribution_paid", "p2p_match", "system_alert", "demo_event"],
      p2p_status_enum: ["open", "reserved", "completed", "cancelled", "expired"],
      property_status_enum: ["draft", "active", "fully_tokenized", "closed", "liquidated"],
      transaction_status_enum: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
      transaction_type_enum: ["deposit", "withdrawal", "transfer", "mint", "burn", "p2p_buy", "p2p_sell", "distribution", "fee"],
      user_role_enum: ["investor", "admin", "operator", "viewer"],
    },
  },
} as const
