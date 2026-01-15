export interface AcademicYear {
    id: string;
    year_code: string; // Backend uses 'year_code', not 'code'
    start_date: string;
    end_date: string;
    is_current: boolean;
}

export interface Semester {
    id: string;
    academic_year: string | AcademicYear;
    academic_year_code: string; // From serializer
    semester_number: number; // Backend uses 'semester_number', not 'term'
    start_date: string;
    end_date: string;
}

export interface Course {
    id: string;
    code: string;
    name_vi: string;
    name_km: string | null;
    name_pali: string | null;
    credits: number;
    study_year: number;
    level: string; // 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    category: string; // 'REQUIRED' | 'ELECTIVE'
    knowledge_block: string; // 'VINAYA' | 'SUTTA' | etc.
    description: string | null;
}

export interface Class {
    id: string;
    course: Course; // Nested serialized object usually
    semester: string | Semester;
    classroom: string | null;
    schedule_day: string | null; // 'MON', 'TUE', etc.
    schedule_time: string | null;
    capacity: number;
    enrolled_count: number;
    status: string; // 'PLANNED' | 'OPEN' | 'CLOSED' | 'COMPLETED'
}

export interface Enrollment {
    id: string;
    student: string; // User ID
    class_info: Class; // Renamed from 'class' to avoid keyword conflict, maps to serializer field key
    status: string; // 'REGISTERED' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
    registered_at: string;
}

export interface Grade {
    id: string;
    enrollment: string | Enrollment;
    attendance_score: number | null;
    midterm_score: number | null;
    final_score: number | null;
    total_score: number | null;
    letter_grade: string | null;
    is_passed: boolean;
    gpa: number | null;
}
