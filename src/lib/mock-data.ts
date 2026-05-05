import { differenceInDays, addMonths, subMonths, subDays, addDays } from "date-fns";
import type { Profile, Project, ProjectWithUrgency, MaintenanceUrgency, ClockifyProject } from "@/types";

const TODAY = new Date();

export const MOCK_PROFILES: Profile[] = [
  {
    id: "prof-1",
    full_name: "Martin Benoit",
    role: "admin",
    avatar_url: undefined,
  },
  {
    id: "prof-2",
    full_name: "Julie Mercier",
    role: "user",
    avatar_url: undefined,
  },
  {
    id: "prof-3",
    full_name: "Thomas Ravel",
    role: "user",
    avatar_url: undefined,
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Boutique Delacroix",
    status: "finished",
    launch_date: subMonths(TODAY, 11).toISOString().split("T")[0],
    has_maintenance: true,
    maint_end_date: addDays(TODAY, 8).toISOString().split("T")[0],
    git_url: "https://github.com/agence/boutique-delacroix",
    hosting: "Vercel",
    domain: "boutique-delacroix.fr",
    client_contact: { name: "Édouard Delacroix", email: "e.delacroix@boutique-delacroix.fr", phone: "06 12 34 56 78" },
    dev_id: "prof-1",
    clockify_project_id: "clk-proj-1",
    created_at: subMonths(TODAY, 13).toISOString(),
  },
  {
    id: "proj-2",
    name: "Cabinet Médical Aurore",
    status: "finished",
    launch_date: subMonths(TODAY, 10).toISOString().split("T")[0],
    has_maintenance: true,
    maint_end_date: addDays(TODAY, 22).toISOString().split("T")[0],
    git_url: "https://github.com/agence/cabinet-aurore",
    hosting: "OVH VPS",
    domain: "cabinet-aurore.fr",
    client_contact: { name: "Dr. Sophie Aurore", email: "contact@cabinet-aurore.fr", phone: "04 78 90 12 34" },
    dev_id: "prof-2",
    clockify_project_id: "clk-proj-2",
    created_at: subMonths(TODAY, 12).toISOString(),
  },
  {
    id: "proj-3",
    name: "Restaurant Le Gourmet",
    status: "finished",
    launch_date: subMonths(TODAY, 9).toISOString().split("T")[0],
    has_maintenance: true,
    maint_end_date: addDays(TODAY, 45).toISOString().split("T")[0],
    git_url: "https://github.com/agence/restaurant-gourmet",
    hosting: "Netlify",
    domain: "restaurant-le-gourmet.fr",
    client_contact: { name: "Pierre Fontaine", email: "pierre@legourmet.fr", phone: "06 45 67 89 01" },
    dev_id: "prof-1",
    clockify_project_id: "clk-proj-3",
    created_at: subMonths(TODAY, 11).toISOString(),
  },
  {
    id: "proj-4",
    name: "Immobilier Dupont",
    status: "finished",
    launch_date: subMonths(TODAY, 6).toISOString().split("T")[0],
    has_maintenance: true,
    maint_end_date: addDays(TODAY, 120).toISOString().split("T")[0],
    git_url: "https://github.com/agence/immo-dupont",
    hosting: "Vercel",
    domain: "immobilier-dupont.fr",
    client_contact: { name: "Marie Dupont", email: "m.dupont@immo-dupont.fr", phone: "06 23 45 67 89" },
    dev_id: "prof-3",
    clockify_project_id: "clk-proj-4",
    created_at: subMonths(TODAY, 8).toISOString(),
  },
  {
    id: "proj-5",
    name: "Association SportClub 69",
    status: "finished",
    launch_date: subMonths(TODAY, 3).toISOString().split("T")[0],
    has_maintenance: true,
    maint_end_date: addDays(TODAY, 210).toISOString().split("T")[0],
    git_url: "https://github.com/agence/sportclub-69",
    hosting: "OVH Mutualisé",
    domain: "sportclub69.fr",
    client_contact: { name: "Jean-Luc Bernard", email: "contact@sportclub69.fr", phone: "07 89 01 23 45" },
    dev_id: "prof-2",
    clockify_project_id: null,
    created_at: subMonths(TODAY, 5).toISOString(),
  },
  {
    id: "proj-6",
    name: "TechFlow SaaS",
    status: "dev",
    launch_date: null,
    has_maintenance: false,
    maint_end_date: null,
    git_url: "https://github.com/agence/techflow-saas",
    hosting: "AWS",
    domain: "techflow.io",
    client_contact: { name: "Alexandre Morel", email: "alex@techflow.io", phone: "06 56 78 90 12" },
    dev_id: "prof-1",
    clockify_project_id: "clk-proj-6",
    created_at: subMonths(TODAY, 2).toISOString(),
  },
  {
    id: "proj-7",
    name: "Mairie de Vaulx-en-Velin",
    status: "finished",
    launch_date: subMonths(TODAY, 18).toISOString().split("T")[0],
    has_maintenance: false,
    maint_end_date: null,
    git_url: "https://github.com/agence/mairie-vaulx",
    hosting: "OVH VPS",
    domain: "mairie-vaulx.fr",
    client_contact: { name: "Service Informatique", email: "si@mairie-vaulx.fr", phone: "04 72 02 64 30" },
    dev_id: "prof-3",
    clockify_project_id: "clk-proj-7",
    created_at: subMonths(TODAY, 20).toISOString(),
  },
  {
    id: "proj-8",
    name: "Mode Chic E-boutique",
    status: "finished",
    launch_date: subMonths(TODAY, 13).toISOString().split("T")[0],
    has_maintenance: true,
    maint_end_date: subDays(TODAY, 5).toISOString().split("T")[0],
    git_url: "https://github.com/agence/mode-chic",
    hosting: "Vercel",
    domain: "mode-chic.fr",
    client_contact: { name: "Isabelle Martin", email: "i.martin@mode-chic.fr", phone: "06 34 56 78 90" },
    dev_id: "prof-2",
    clockify_project_id: "clk-proj-8",
    created_at: subMonths(TODAY, 15).toISOString(),
  },
];

export const MOCK_CLOCKIFY_DATA: Record<string, ClockifyProject> = {
  "clk-proj-1": {
    id: "clk-proj-1",
    name: "Boutique Delacroix - Maintenance",
    estimate: { estimate: "PT40H", type: "MANUAL" },
    timeEstimate: { estimate: 144000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT38H30M",
    budgetEstimate: 1200,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
  "clk-proj-2": {
    id: "clk-proj-2",
    name: "Cabinet Médical - Maintenance",
    estimate: { estimate: "PT20H", type: "MANUAL" },
    timeEstimate: { estimate: 72000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT8H15M",
    budgetEstimate: 600,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
  "clk-proj-3": {
    id: "clk-proj-3",
    name: "Restaurant Le Gourmet - Maintenance",
    estimate: { estimate: "PT30H", type: "MANUAL" },
    timeEstimate: { estimate: 108000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT12H45M",
    budgetEstimate: 900,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
  "clk-proj-4": {
    id: "clk-proj-4",
    name: "Immobilier Dupont - Maintenance",
    estimate: { estimate: "PT60H", type: "MANUAL" },
    timeEstimate: { estimate: 216000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT22H00M",
    budgetEstimate: 1800,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
  "clk-proj-6": {
    id: "clk-proj-6",
    name: "TechFlow SaaS - Dev",
    estimate: { estimate: "PT200H", type: "MANUAL" },
    timeEstimate: { estimate: 720000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT87H30M",
    budgetEstimate: 6000,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
  "clk-proj-7": {
    id: "clk-proj-7",
    name: "Mairie de Vaulx-en-Velin",
    estimate: { estimate: "PT150H", type: "MANUAL" },
    timeEstimate: { estimate: 540000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT162H00M",
    budgetEstimate: 4500,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
  "clk-proj-8": {
    id: "clk-proj-8",
    name: "Mode Chic E-boutique - Maintenance",
    estimate: { estimate: "PT50H", type: "MANUAL" },
    timeEstimate: { estimate: 180000, type: "MANUAL", resetOption: null, active: true, includeNonBillable: false },
    duration: "PT54H20M",
    budgetEstimate: 1500,
    hourlyRate: { amount: 3000, currency: "EUR" },
  },
};

function computeUrgency(project: Project): { urgency: MaintenanceUrgency; daysRemaining: number | null } {
  if (!project.has_maintenance || !project.maint_end_date) {
    return { urgency: "none", daysRemaining: null };
  }
  const days = differenceInDays(new Date(project.maint_end_date), TODAY);
  if (days < 0) return { urgency: "expired", daysRemaining: days };
  if (days <= 15) return { urgency: "critical", daysRemaining: days };
  if (days <= 30) return { urgency: "warning", daysRemaining: days };
  if (days <= 60) return { urgency: "caution", daysRemaining: days };
  return { urgency: "ok", daysRemaining: days };
}

export function getMockProjectsWithUrgency(): ProjectWithUrgency[] {
  return MOCK_PROJECTS.map((p) => {
    const { urgency, daysRemaining } = computeUrgency(p);
    const dev = MOCK_PROFILES.find((pr) => pr.id === p.dev_id) ?? MOCK_PROFILES[0];
    return { ...p, urgency, daysRemaining, dev };
  }).sort((a, b) => {
    const order: MaintenanceUrgency[] = ["expired", "critical", "warning", "caution", "ok", "none"];
    const ai = order.indexOf(a.urgency);
    const bi = order.indexOf(b.urgency);
    if (ai !== bi) return ai - bi;
    if (a.daysRemaining !== null && b.daysRemaining !== null) return a.daysRemaining - b.daysRemaining;
    return 0;
  });
}

export function getMockDashboardStats() {
  const projects = getMockProjectsWithUrgency();
  return {
    total: projects.length,
    withMaintenance: projects.filter((p) => p.has_maintenance).length,
    inDev: projects.filter((p) => p.status === "dev").length,
    critical: projects.filter((p) => p.urgency === "critical" || p.urgency === "warning").length,
    expired: projects.filter((p) => p.urgency === "expired").length,
  };
}
