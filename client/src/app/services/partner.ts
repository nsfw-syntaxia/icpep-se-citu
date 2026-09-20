import { api } from './api-client';

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  type: 'sponsor' | 'partner';
  description?: string; // Used for Tier (Platinum, Gold, etc.)
  website?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerData {
  name: string;
  type: string;
  description?: string;
  website?: string;
  logo: File;
}

export interface UpdatePartnerData {
  name?: string;
  type?: string;
  description?: string;
  website?: string;
  logo?: File;
  isActive?: boolean;
  displayOrder?: number;
}

const partnerService = {
  getAll: async (type?: string) => {
    const response = await api.get<Partner[]>('/partners', {
      params: { type },
    });
    return response.data;
  },

  create: async (data: CreatePartnerData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    if (data.website) formData.append('website', data.website);
    formData.append('logo', data.logo);

    const response = await api.post<Partner>('/partners', formData);
    return response.data;
  },

  update: async (id: string, data: UpdatePartnerData) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.type) formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    if (data.website) formData.append('website', data.website);
    if (data.logo) formData.append('logo', data.logo);
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

    const response = await api.put<Partner>(`/partners/${id}`, formData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },
};

export default partnerService;
