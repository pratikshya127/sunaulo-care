import { apiFetch } from "./auth";

export type Medicine = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  reminder_times: string[];
  instructions?: string;
  active: boolean;
  elderly_id?: number;
  elderly_name?: string;
};

export type MedicineLog = {
  id: number;
  medicine_id: number;
  medicine_name?: string;
  elderly_id?: number;
  taken: boolean;
  taken_time?: string;
  remarks?: string;
  created_at: string;
};

export type HealthRecord = {
  id: number;
  elderly_id?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  sugar_level?: number;
  weight?: number;
  temperature?: number;
  oxygen_level?: number;
  pulse_rate?: number;
  water_intake?: number;
  sleep_hours?: number;
  notes?: string;
  recorded_by?: number;
  created_at: string;
};

export type ElderlyProfile = {
  id: number;
  user_id: number;
  name: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  medical_conditions?: string[];
  caregiver_id?: number;
};

export type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};

export type SOSAlert = {
  id: number;
  elderly_id?: number;
  message?: string;
  latitude?: number;
  longitude?: number;
  status: "active" | "acknowledged" | "resolved";
  created_at: string;
};

export type DashboardData = {
  role: string;
  total_elderly?: number;
  active_sos_count?: number;
  today_compliance?: number;
  recent_health_records?: HealthRecord[];
  today_medicines?: { total: number; taken: number; pending: number; skipped: number };
  latest_vitals?: Partial<HealthRecord>;
  active_sos?: boolean;
  monitored_elderly?: number;
  unread_notifications?: number;
};

export const api = {
  dashboard: (): Promise<DashboardData> => apiFetch("/dashboard"),

  medicines: {
    list: (): Promise<{ data: Medicine[] }> => apiFetch("/medicines"),
    today: (): Promise<{ data: Medicine[] }> => apiFetch("/medicines/today"),
    store: (data: {
      elderly_id: number;
      name: string;
      dosage: string;
      frequency: string;
      reminder_times: string[];
      instructions?: string;
    }) => apiFetch("/medicines", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Medicine>) =>
      apiFetch(`/medicines/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/medicines/${id}`, { method: "DELETE" }),
  },

  medicineLogs: {
    list: (): Promise<{ data: MedicineLog[] }> => apiFetch("/medicine-logs"),
    store: (data: { medicine_id: number; taken: boolean; remarks?: string }) =>
      apiFetch("/medicine-logs", { method: "POST", body: JSON.stringify(data) }),
  },

  healthRecords: {
    list: (): Promise<{ data: HealthRecord[] }> => apiFetch("/health-records"),
    store: (data: Partial<HealthRecord>) =>
      apiFetch("/health-records", { method: "POST", body: JSON.stringify(data) }),
  },

  elderly: {
    list: (): Promise<{ data: ElderlyProfile[] }> => apiFetch("/elderly"),
    store: (data: Partial<ElderlyProfile> & { name: string }) =>
      apiFetch("/elderly", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<ElderlyProfile>) =>
      apiFetch(`/elderly/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  notifications: {
    list: (): Promise<{ data: Notification[] }> => apiFetch("/notifications"),
    markRead: (id: number) => apiFetch(`/notifications/${id}/read`, { method: "POST" }),
    markAllRead: () => apiFetch("/notifications/read-all", { method: "POST" }),
    delete: (id: number) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),
  },

  sos: {
    list: (): Promise<{ data: SOSAlert[] }> => apiFetch("/sos-alerts"),
    trigger: (data: { message?: string; latitude?: number; longitude?: number }) =>
      apiFetch("/sos-alerts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: { status: SOSAlert["status"] }) =>
      apiFetch(`/sos-alerts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  reports: {
    health: () => apiFetch("/reports/health"),
    medicines: () => apiFetch("/reports/medicines"),
  },
};
