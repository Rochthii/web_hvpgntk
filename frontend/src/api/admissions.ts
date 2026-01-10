import client from './client';

export interface AdmissionPeriod {
    id: string;
    admission_year: string;
    application_start_date: string;
    application_end_date: string;
    result_announcement_date: string | null;
    status: 'UPCOMING' | 'OPEN' | 'CLOSED' | 'COMPLETED';
    notes: string;
}

export const admissionsApi = {
    // Get currently active or upcoming period
    getCurrentPeriod: () => client.get<AdmissionPeriod>('/admissions/periods/current/').then(res => ({ ...res, data: (res.data as any).results?.[0] || (res.data as any).result || res.data })),
    getAllPeriods: () => client.get<AdmissionPeriod[]>('/admissions/periods/').then(res => ({ ...res, data: (res.data as any).results || res.data })),

    // Submit application
    submitApplication: (data: any) => client.post('/admissions/applications/', data),
};
