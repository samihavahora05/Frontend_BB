import api from "../axios";
import { partnerCompanies, Company } from "../../data/companies";
import { getSessions } from "../authUtils";

export interface CMSCompany {
  id: string | number;
  name: string;
  slug?: string;
  industry: string;
  logoUrl: string;
  location?: string;
  website_url?: string;
  status?: "published" | "draft" | "archived" | "active" | string;
  is_featured?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

const STORAGE_KEY = "bb_admin_companies_sync_v3";

// Initial seed: strictly the 41 companies configured in the Admin Companies panel
export const getInitialVerifiedCompanies = (): CMSCompany[] => {
  return partnerCompanies.map((c, index) => ({
    id: c.id,
    name: c.name,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    industry: c.industry || "IT & Software Development",
    logoUrl: c.logoUrl || "/logo/damyaa.png",
    location: c.location || "India",
    website_url: "",
    status: c.status || "published",
    is_featured: c.is_featured !== undefined ? c.is_featured : index < 8,
    display_order: index + 1,
  }));
};

export const CompanyService = {
  // Read all companies from local cache / fallback seed
  getLocalCompanies(): CMSCompany[] {
    if (typeof window === "undefined") return getInitialVerifiedCompanies();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored contains valid companies, return them
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading local companies:", e);
    }
    const initial = getInitialVerifiedCompanies();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {}
    return initial;
  },

  // Save to local cache and broadcast update event across all windows and tabs
  saveLocalCompanies(companies: CMSCompany[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
      window.dispatchEvent(new CustomEvent("bb_companies_updated", { detail: companies }));
      
      // Multi-tab BroadcastChannel communication
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("bb_companies_channel");
          bc.postMessage({ type: "SYNC_COMPANIES", data: companies });
          bc.close();
        }
      } catch (_) {}
    } catch (e) {
      console.error("Error saving local companies:", e);
    }
  },

  // Subscribe to live company updates across tabs
  subscribe(callback: (companies: CMSCompany[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handleLocal = (e: any) => {
      callback(e.detail || this.getLocalCompanies());
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch (_) {
          callback(this.getLocalCompanies());
        }
      }
    };

    window.addEventListener("bb_companies_updated", handleLocal);
    window.addEventListener("storage", handleStorage);

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("bb_companies_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "SYNC_COMPANIES" && Array.isArray(event.data.data)) {
            callback(event.data.data);
          }
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener("bb_companies_updated", handleLocal);
      window.removeEventListener("storage", handleStorage);
      if (bc) bc.close();
    };
  },

  // Fetch companies from API (queries admin endpoint for admin sessions, public endpoint otherwise)
  async getAll(): Promise<CMSCompany[]> {
    const isBrowser = typeof window !== "undefined";
    const sessions = isBrowser ? getSessions() : {};
    const isAdmin = isBrowser && (
      window.location.pathname.startsWith('/admin') ||
      !!(sessions['admin']?.token || sessions['super_admin']?.token)
    );

    // 1. Try admin endpoint first ONLY if logged in as admin / on admin dashboard
    if (isAdmin) {
      try {
        const res = await api.get("/admin/cms/companies");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const normalized: CMSCompany[] = res.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            industry: c.industry?.name || c.industry || "IT & Software Development",
            logoUrl: c.logo_url || c.logoUrl || "/logo/damyaa.png",
            location: c.location || "India",
            website_url: c.website_url || "",
            status: c.status || "published",
            is_featured: !!c.is_featured,
            display_order: c.display_order || 0,
          }));
          this.saveLocalCompanies(normalized);
          return normalized;
        }
      } catch (err) {
        // Fallback to public endpoint if admin endpoint fails
      }
    }

    // 2. Query public endpoint
    try {
      const res = await api.get("/cms/companies");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const normalized: CMSCompany[] = res.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          industry: c.industry?.name || c.industry || "IT & Software Development",
          logoUrl: c.logo_url || c.logoUrl || "/logo/damyaa.png",
          location: c.location || "India",
          website_url: c.website_url || "",
          status: c.status || "published",
          is_featured: !!c.is_featured,
          display_order: c.display_order || 0,
        }));
        this.saveLocalCompanies(normalized);
        return normalized;
      }
    } catch (err) {
      // Backend offline or unreachable
    }

    return this.getLocalCompanies();
  },

  // Public fetcher: returns only published companies
  async getPublicCompanies(): Promise<CMSCompany[]> {
    try {
      const all = await this.getAll();
      return all.filter((c) => !c.status || c.status === "published");
    } catch (_) {
      const local = this.getLocalCompanies();
      return local.filter((c) => !c.status || c.status === "published");
    }
  },

  // Lookup single company by ID or slug
  getCompanyByIdOrSlug(idOrSlug: string | number): CMSCompany | undefined {
    const list = this.getLocalCompanies();
    const str = String(idOrSlug).toLowerCase();
    return list.find((c) => String(c.id) === str || (c.slug && c.slug.toLowerCase() === str));
  },

  // Add new company from Admin
  async create(data: Partial<CMSCompany>): Promise<CMSCompany> {
    const current = this.getLocalCompanies();
    const newId = `c_${Date.now()}`;
    const newCompany: CMSCompany = {
      id: newId,
      name: data.name || "Untitled Company",
      slug: (data.name || "company").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      industry: data.industry || "IT & Software Development",
      logoUrl: data.logoUrl || "/logo/damyaa.png",
      location: data.location || "India",
      website_url: data.website_url || "",
      status: data.status || "published",
      is_featured: !!data.is_featured,
      display_order: current.length + 1,
    };

    // Try backend API creation
    try {
      const res = await api.post("/admin/cms/companies", {
        name: newCompany.name,
        logo_url: newCompany.logoUrl,
        location: newCompany.location,
        website_url: newCompany.website_url,
        industry: newCompany.industry,
        status: newCompany.status,
        is_featured: newCompany.is_featured,
      });
      if (res.data?.id) {
        newCompany.id = res.data.id;
      }
    } catch (err) {
      console.warn("API save failed, saved locally:", err);
    }

    const updated = [newCompany, ...current];
    this.saveLocalCompanies(updated);
    return newCompany;
  },

  // Update existing company from Admin
  async update(id: string | number, data: Partial<CMSCompany>): Promise<CMSCompany> {
    const current = this.getLocalCompanies();
    const index = current.findIndex((c) => String(c.id) === String(id));
    if (index === -1) throw new Error("Company not found");

    const updatedCompany: CMSCompany = {
      ...current[index],
      ...data,
      name: data.name ?? current[index].name,
      slug: data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : current[index].slug,
      logoUrl: data.logoUrl ?? current[index].logoUrl,
      industry: data.industry ?? current[index].industry,
      location: data.location ?? current[index].location,
      website_url: data.website_url ?? current[index].website_url,
      status: data.status ?? current[index].status,
      is_featured: data.is_featured !== undefined ? !!data.is_featured : current[index].is_featured,
    };

    // Try backend API update
    try {
      await api.put(`/admin/cms/companies/${id}`, {
        name: updatedCompany.name,
        logo_url: updatedCompany.logoUrl,
        location: updatedCompany.location,
        website_url: updatedCompany.website_url,
        industry: updatedCompany.industry,
        status: updatedCompany.status,
        is_featured: updatedCompany.is_featured,
      });
    } catch (err) {
      console.warn("API update failed, saved locally:", err);
    }

    current[index] = updatedCompany;
    this.saveLocalCompanies([...current]);
    return updatedCompany;
  },

  // Delete company from Admin
  async delete(id: string | number): Promise<void> {
    // Try backend API delete
    try {
      await api.delete(`/admin/cms/companies/${id}`);
    } catch (err) {
      console.warn("API delete failed, removed locally:", err);
    }

    const current = this.getLocalCompanies();
    const updated = current.filter((c) => String(c.id) !== String(id));
    this.saveLocalCompanies(updated);
  },
};
