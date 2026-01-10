import client from './client';
import { User } from '../types/auth'; // Assuming User type is here

export interface RequestType {
    id: string;
    name: string;
    code: string;
    description: string;
}

export interface ApprovalLog {
    id: string;
    actor_name: string;
    action: string;
    note: string;
    created_at: string;
}

export interface StudentRequest {
    id: string;
    request_type: string; // ID of RequestType
    request_type_name: string;
    title: string;
    reason: string;
    attachment: string | null;
    status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    status_display: string;
    admin_response: string | null;
    created_at: string;
    logs: ApprovalLog[];
}

export const approvalsApi = {
    getRequestTypes: () => client.get<RequestType[]>('/approvals/types/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    getMyRequests: () => client.get<StudentRequest[]>('/approvals/requests/').then(res => ({ ...res, data: (res.data as any).results || res.data })),
    createRequest: (data: any) => client.post('/approvals/requests/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    cancelRequest: (id: string) => client.post(`/approvals/requests/${id}/cancel/`),
};
