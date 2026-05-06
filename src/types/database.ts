export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: "admin" | "user";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: "admin" | "user";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: "admin" | "user";
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          status: "dev" | "finished";
          launch_date: string | null;
          has_maintenance: boolean;
          maint_end_date: string | null;
          git_url: string;
          hosting: string;
          domain: string;
          client_contact: { name: string; email: string; phone: string };
          dev_id: string;
          clockify_projects: Array<{ id: string; label: string }>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: "dev" | "finished";
          launch_date?: string | null;
          has_maintenance?: boolean;
          maint_end_date?: string | null;
          git_url?: string;
          hosting?: string;
          domain?: string;
          client_contact?: { name: string; email: string; phone: string };
          dev_id: string;
          clockify_projects?: Array<{ id: string; label: string }>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: "dev" | "finished";
          launch_date?: string | null;
          has_maintenance?: boolean;
          maint_end_date?: string | null;
          git_url?: string;
          hosting?: string;
          domain?: string;
          client_contact?: { name: string; email: string; phone: string };
          dev_id?: string;
          clockify_projects?: Array<{ id: string; label: string }>;
        };
      };
    };
  };
}
