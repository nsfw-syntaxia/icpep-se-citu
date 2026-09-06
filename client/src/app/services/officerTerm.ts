import axios from 'axios';

const _RAW_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = (() => {
    try {
        let base = String(_RAW_API).replace(/\/+$/, '');
        if (!base.endsWith('/api')) base = `${base}/api`;
        return base;
    } catch {
        return 'http://localhost:5000/api';
    }
})();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        if (config.headers && 'Content-Type' in config.headers) {
            const headers = config.headers as Record<string, unknown> | undefined;
            if (headers && Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) {
                delete headers['Content-Type'];
            }
        }
    }
    return config;
});

export interface OfficerTermData {
    _id?: string;
    name: string;
    position: string;
    role?: string;
    departmentType: 'executive' | 'committee';
    committeeName?: string;
    termYear: string;
    image?: File | string;
    isActive?: boolean;
    displayOrder?: number;
}

const officerTermService = {
    createOfficerTerm: async (data: OfficerTermData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('position', data.position);
        if (data.role) formData.append('role', data.role);
        formData.append('departmentType', data.departmentType);
        if (data.committeeName) formData.append('committeeName', data.committeeName);
        formData.append('termYear', data.termYear);
        if (data.image instanceof File) formData.append('image', data.image);
        if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
        if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

        const response = await api.post('/officer-terms', formData);
        return response.data;
    },

    getOfficerTerms: async (params?: { year?: string; departmentType?: string; committeeName?: string }) => {
        const response = await api.get('/officer-terms', { params });
        return response.data;
    },

    getYears: async () => {
        const response = await api.get('/officer-terms/years');
        return response.data;
    },

    getAllOfficerTerms: async () => {
        const response = await api.get('/officer-terms/admin');
        return response.data;
    },

    updateOfficerTerm: async (id: string, data: Partial<OfficerTermData>) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.position) formData.append('position', data.position);
        if (data.role !== undefined) formData.append('role', data.role || '');
        if (data.departmentType) formData.append('departmentType', data.departmentType);
        if (data.committeeName !== undefined) formData.append('committeeName', data.committeeName || '');
        if (data.termYear) formData.append('termYear', data.termYear);
        if (data.image instanceof File) formData.append('image', data.image);
        if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
        if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

        const response = await api.put(`/officer-terms/${id}`, formData);
        return response.data;
    },

    deleteOfficerTerm: async (id: string) => {
        const response = await api.delete(`/officer-terms/${id}`);
        return response.data;
    },
};

export default officerTermService;
