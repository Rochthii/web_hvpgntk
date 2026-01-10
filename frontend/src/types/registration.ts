
export interface RegistrationClass {
    id: number;
    class_code: string;
    course_name: string;
    course_code: string;
    credits: number;
    instructor: string;
    schedule: any; // JSON schedule data
    room: string;
    max_students: number;
    current_students: number;
    is_full: boolean;
    is_enrolled: boolean;
    semester: string;
}

export interface RegistrationState {
    selectedClasses: RegistrationClass[];
    totalCredits: number;
    isSubmitting: boolean;
    error: string | null;
}
