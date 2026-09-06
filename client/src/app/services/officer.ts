import axios, { AxiosError } from "axios";

const _RAW_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = (() => {
  try {
    let base = String(_RAW_API).replace(/\/+$/, "");
    if (!base.endsWith("/api")) base = `${base}/api`;
    return base;
  } catch {
    return "http://localhost:5000/api";
  }
})();

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => Promise.reject(error)
);

export interface Officer {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: "council-officer" | "committee-officer";
  position?: string;
  department?: string;
  yearLevel?: number;
  profilePicture?: string;
  email?: string;
  studentNumber: string;
  // A student can hold both a council and a committee assignment at once —
  // these two pairs are independent of each other and of the legacy fields above.
  councilPosition?: string;
  councilYearLevel?: number;
  committeeDepartment?: string;
  committeeTitle?: string;
}

export interface UpdateOfficerData {
  assignmentType: "council" | "committee";
  position?: string;
  department?: string;
  yearLevel?: number;
  profilePicture?: string;
  remove?: boolean;
  termYear?: string;
}

const officerService = {
  getOfficers: async () => {
    const response = await api.get<{ success: boolean; data: Officer[] }>(
      "/officers"
    );
    return response.data.data;
  },

  // Public roster (no auth required) for the About/Home pages
  getPublicOfficers: async (department?: string) => {
    const response = await api.get<{ success: boolean; data: Officer[] }>(
      "/officers/public",
      { params: department ? { department } : undefined }
    );
    return response.data.data;
  },

  searchNonOfficers: async (query: string, type: "council" | "committee") => {
    const response = await api.get<{ success: boolean; data: Officer[] }>(
      "/officers/search",
      { params: { query, type } }
    );
    return response.data.data;
  },

  updateOfficer: async (id: string, data: UpdateOfficerData) => {
    const response = await api.put<{ success: boolean; data: Officer }>(
      `/officers/${id}`,
      data
    );
    return response.data.data;
  },
};

export default officerService;
