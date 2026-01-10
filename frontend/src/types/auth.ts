export interface MonkProfile {
    id: string;
    dharma_name_khmer: string;
    dharma_name_pali: string;
    dharma_name_vietnamese: string;
    student_code: string | null;
    temple: string;
    current_temple?: string; // Client-side alias for temple
    vassa_count: number;
    ordination_date: string | null;
}

export interface LaypersonProfile {
    id: string;
    full_name: string;
    legal_name: string;
    student_code: string | null;
    occupation: string | null;
}

export interface User {
    id: string;
    email: string | null;
    phone: string | null;
    user_type: 'monk' | 'layperson';
    role: string;
    display_name: string;
    avatar_url?: string | null;
    is_active: boolean;
    monk_profile?: MonkProfile;
    layperson_profile?: LaypersonProfile;
}

export interface LoginResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
