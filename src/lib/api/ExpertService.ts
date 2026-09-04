import api from "../axios";
import { getImageUrl } from "../imageUtils";
import { getSessions } from "../authUtils";

export interface ExpertData {
  id: string | number;
  user_id?: string | number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  company: string;
  specialization: string;
  hourly_rate: number;
  avatar: string;
  profile_photo?: string;
  average_rating: number;
  total_reviews: number;
  is_available: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export const formatExpertAvatar = (raw: string | null | undefined): string => {
  return getImageUrl(raw);
};

export const normalizeExpert = (item: any): ExpertData => {
  if (!item) {
    return {
      id: 0,
      first_name: "Expert",
      last_name: "",
      name: "Expert",
      email: "",
      phone: "",
      designation: "Expert",
      company: "Independent",
      specialization: "Career & Technical Mentorship",
      hourly_rate: 1500,
      avatar: "",
      profile_photo: "",
      average_rating: 5.0,
      total_reviews: 0,
      is_available: true,
      is_verified: true,
    };
  }

  const firstName = item.first_name || item.user?.first_name || (item.name ? item.name.split(" ")[0] : "Expert");
  const lastName = item.last_name || item.user?.last_name || (item.name ? item.name.split(" ").slice(1).join(" ") : "");
  const fullName = item.name || `${firstName} ${lastName}`.trim() || firstName || "Expert";

  const rawPhoto = item.avatar || item.profile_photo || item.photo || item.user?.profile_photo || item.user?.avatar;
  const avatarUrl = formatExpertAvatar(rawPhoto);

  const rate = Number(
    item.hourly_rate !== undefined && item.hourly_rate !== null && Number(item.hourly_rate) > 0
      ? item.hourly_rate
      : item.financials?.hourly_rate !== undefined && Number(item.financials?.hourly_rate) > 0
        ? item.financials?.hourly_rate
        : 1500
  );

  return {
    id: item.id || item.user_id || 0,
    user_id: item.user_id || item.user?.id || item.id || 0,
    first_name: firstName,
    last_name: lastName,
    name: fullName,
    email: item.email || item.user?.email || "",
    phone: item.phone || item.user?.phone || "",
    designation: item.designation || item.professional_details?.designation || "Expert",
    company: item.company || item.professional_details?.company || "Independent",
    specialization: item.specialization || item.professional_details?.specialization || "Career & Technical Mentorship",
    hourly_rate: rate,
    avatar: avatarUrl,
    profile_photo: avatarUrl,
    average_rating: Number(item.average_rating || 5.0),
    total_reviews: Number(item.total_reviews || 0),
    is_available: item.is_available !== undefined ? Boolean(item.is_available) : true,
    is_verified: item.is_verified !== undefined ? Boolean(item.is_verified) : true,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
  };
};

let inMemoryCache: ExpertData[] | null = null;

export const ExpertService = {
  getLocalExperts(): ExpertData[] {
    return inMemoryCache || [];
  },

  setLocalCache(list: ExpertData[]) {
    inMemoryCache = list;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bb_cached_experts_v2", JSON.stringify(list));
      } catch {}
    }
  },

  async getAll(): Promise<ExpertData[]> {
    let apiExperts: any[] = [];
    let lastError: any = null;

    const isBrowser = typeof window !== "undefined";
    const sessions = isBrowser ? getSessions() : {};
    const isAdmin = isBrowser && (
      window.location.pathname.startsWith('/admin') ||
      !!(sessions['admin']?.token || sessions['super_admin']?.token)
    );

    // 1. Try admin instructors endpoint first if user is admin
    if (isAdmin) {
      try {
        const res = await api.get(`/admin/instructors?per_page=100&_t=${Date.now()}`);
        apiExperts = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
      } catch (adminErr) {
        lastError = adminErr;
      }
    }

    // 2. Query public endpoint if not admin or admin request returned empty/error
    if (apiExperts.length === 0) {
      try {
        const res = await api.get(`/public/experts?per_page=100&_t=${Date.now()}`);
        apiExperts = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
        lastError = null;
      } catch (publicErr) {
        lastError = publicErr;
      }
    }

    if (lastError && apiExperts.length === 0) {
      const cached = this.getLocalExperts();
      if (cached.length > 0) return cached;
      throw lastError;
    }

    const normalized = (Array.isArray(apiExperts) ? apiExperts : []).map(normalizeExpert);
    this.setLocalCache(normalized);
    return normalized;
  },

  async fetchExpertById(id: string | number): Promise<ExpertData | null> {
    try {
      const res = await api.get(`/public/experts/${id}`);
      const data = res?.data?.data || res?.data;
      if (data) {
        return normalizeExpert(data);
      }
    } catch {}

    try {
      const res = await api.get(`/admin/instructors/${id}`);
      const data = res?.data?.data || res?.data;
      if (data) {
        return normalizeExpert(data);
      }
    } catch {}

    return null;
  },

  getExpertById(idOrEmailOrName: string | number): ExpertData | null {
    const experts = this.getLocalExperts();
    const search = String(idOrEmailOrName).toLowerCase().trim();
    return (
      experts.find(
        (e) =>
          String(e.id) === search ||
          String(e.user_id) === search ||
          e.email.toLowerCase() === search ||
          e.name.toLowerCase().trim() === search ||
          e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === search
      ) || null
    );
  },

  async createExpert(data: {
    first_name: string;
    last_name?: string;
    email: string;
    password?: string;
    phone?: string;
    designation: string;
    company: string;
    specialization: string;
    hourly_rate: number;
    avatar?: string;
    avatarFile?: File | null;
  }): Promise<ExpertData> {
    const fullName = `${data.first_name} ${data.last_name || ""}`.trim();
    const formData = new FormData();
    formData.set("first_name", data.first_name);
    formData.set("last_name", data.last_name || "");
    formData.set("name", fullName);
    formData.set("email", data.email);
    formData.set("password", data.password || "Password@123");
    formData.set("role", "expert");
    formData.set("phone", data.phone || "");
    formData.set("designation", data.designation);
    formData.set("company", data.company);
    formData.set("specialization", data.specialization);
    formData.set("hourly_rate", String(data.hourly_rate));

    if (data.avatarFile) {
      formData.append("avatar", data.avatarFile);
      formData.append("profile_photo", data.avatarFile);
    } else if (data.avatar) {
      formData.set("avatar", data.avatar);
      formData.set("profile_photo", data.avatar);
    }

    let createdData = null;
    try {
      const res = await api.post("/admin/instructors", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      createdData = res?.data?.data || res?.data;
    } catch {
      const res = await api.post("/admin/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      createdData = res?.data?.data || res?.data;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("bb_experts_updated"));
    }

    return normalizeExpert(createdData || data);
  },

  async updateExpert(
    id: string | number,
    data: Partial<ExpertData> & { password?: string; avatarFile?: File | null }
  ): Promise<ExpertData> {
    const formData = new FormData();
    if (data.first_name !== undefined) formData.set("first_name", data.first_name);
    if (data.last_name !== undefined) formData.set("last_name", data.last_name);
    if (data.name) formData.set("name", data.name);
    if (data.email) formData.set("email", data.email);
    if (data.password) formData.set("password", data.password);
    if (data.phone !== undefined) formData.set("phone", data.phone);
    if (data.designation) formData.set("designation", data.designation);
    if (data.company) formData.set("company", data.company);
    if (data.specialization) formData.set("specialization", data.specialization);
    if (data.hourly_rate !== undefined) formData.set("hourly_rate", String(data.hourly_rate));

    if (data.avatarFile) {
      formData.append("avatar", data.avatarFile);
      formData.append("profile_photo", data.avatarFile);
    } else if (data.avatar) {
      formData.set("avatar", data.avatar);
      formData.set("profile_photo", data.avatar);
    }
    formData.set("_method", "PUT");

    let updatedData = null;
    try {
      const res = await api.post(`/admin/instructors/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updatedData = res?.data?.data || res?.data;
    } catch {
      const res = await api.post(`/admin/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updatedData = res?.data?.data || res?.data;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("bb_experts_updated"));
    }

    return normalizeExpert(updatedData || data);
  },

  async deleteExpert(id: string | number): Promise<boolean> {
    const strId = String(id);
    try {
      await api.delete(`/admin/instructors/${id}`).catch(() => api.delete(`/admin/users/${id}`));
    } catch (err) {
      console.warn("Backend delete notice:", err);
    }

    const current = this.getLocalExperts();
    const filtered = current.filter((e) => String(e.id) !== strId && String(e.user_id) !== strId);
    this.setLocalCache(filtered);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("bb_experts_updated"));
    }
    return true;
  },
};
