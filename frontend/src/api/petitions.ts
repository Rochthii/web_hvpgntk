import client from './client';

export interface PetitionType {
    id: string;
    name: string;
    code: string;
    description: string;
    requires_approval_from: string[];
    auto_approve: boolean;
    max_processing_days: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PetitionHistory {
    id: string;
    actor: string;
    actor_detail: {
        id: string;
        email: string;
        display_name: string;
    };
    action: string;
    action_display: string;
    note: string;
    timestamp: string;
}

export interface Petition {
    id: string;
    petitioner: string;
    petitioner_detail: {
        id: string;
        email: string;
        display_name: string;
    };
    petition_type: string;
    petition_type_detail: PetitionType;
    title: string;
    reason: string;
    attachment: string | null;
    attachment_url: string;
    status: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    status_display: string;
    submitted_at: string | null;
    processed_at: string | null;
    processing_deadline: string | null;
    admin_response: string;
    final_decision: string;
    history: PetitionHistory[];
    created_at: string;
    updated_at: string;
}

export interface PetitionCreateData {
    petition_type: string;
    title: string;
    reason: string;
    attachment?: File;
    attachment_url?: string;
}

export interface PetitionApprovalData {
    action: 'APPROVE' | 'REJECT';
    note?: string;
    final_decision?: string;
}

export const petitionsApi = {
    // Petition Types
    getPetitionTypes: () =>
        client.get<PetitionType[]>('/petitions/types/')
            .then(res => ({ ...res, data: (res.data as any).results || res.data })),

    getPetitionType: (id: string) =>
        client.get<PetitionType>(`/petitions/types/${id}/`),

    // Petitions
    getMyPetitions: () =>
        client.get<Petition[]>('/petitions/')
            .then(res => ({ ...res, data: (res.data as any).results || res.data })),

    getAllPetitions: (status?: string) => {
        const params = status ? { status } : {};
        return client.get<Petition[]>('/petitions/', { params })
            .then(res => ({ ...res, data: (res.data as any).results || res.data }));
    },

    getPetition: (id: string) =>
        client.get<Petition>(`/petitions/${id}/`),

    createPetition: (data: PetitionCreateData) => {
        const formData = new FormData();
        formData.append('petition_type', data.petition_type);
        formData.append('title', data.title);
        formData.append('reason', data.reason);

        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }
        if (data.attachment_url) {
            formData.append('attachment_url', data.attachment_url);
        }

        return client.post<Petition>('/petitions/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Workflow actions
    submitPetition: (id: string) =>
        client.post<Petition>(`/petitions/${id}/submit/`),

    reviewPetition: (id: string, data: PetitionApprovalData) =>
        client.post<Petition>(`/petitions/${id}/review/`, data),

    cancelPetition: (id: string) =>
        client.post<Petition>(`/petitions/${id}/cancel/`),

    addComment: (id: string, note: string) =>
        client.post<Petition>(`/petitions/${id}/add_comment/`, { note }),
};
