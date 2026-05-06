export type UserRole = "admin" | "user";
export type ProjectStatus = "dev" | "finished";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface ClientContact {
  name: string;
  email: string;
  phone: string;
}

export interface ClockifyLink {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  launch_date: string | null;
  has_maintenance: boolean;
  maint_end_date: string | null;
  git_url: string;
  hosting: string;
  domain: string;
  client_contact: ClientContact;
  dev_id: string;
  clockify_projects: ClockifyLink[];
  created_at: string;
}

export interface ClockifyProject {
  id: string;
  name: string;
  estimate: {
    estimate: string;
    type: "AUTO" | "MANUAL";
  };
  timeEstimate: {
    estimate: number;
    type: string;
    resetOption: string | null;
    active: boolean;
    includeNonBillable: boolean;
  };
  duration: string;
  budgetEstimate: number | null;
  hourlyRate: {
    amount: number;
    currency: string;
  } | null;
}

export type MaintenanceUrgency = "critical" | "warning" | "caution" | "ok" | "expired" | "none";

export interface ProjectWithUrgency extends Project {
  urgency: MaintenanceUrgency;
  daysRemaining: number | null;
  dev: Profile;
}
