export type Priority = "High" | "Medium" | "Low";

export interface ActionItem {
  id: string;
  text: string;
  status: "pending" | "completed";
  priority: Priority;
  createdAt: string;
}

export type FilterStatus = "all" | "pending" | "completed";
export type SortKey = "createdAt" | "priority" | "status";
