export interface AcademicYear {
    id: string;
    code: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

export interface Semester {
    id: string;
    academic_year: string | AcademicYear;
    term: string; // 'SEMESTER_1' | 'SEMESTER_2' | 'SUMMER'
    start_date: string;
    end_date: string;
    is_current: boolean;
}

export interface Course {
    id: string;
    code: string;
    name_vi: string;
    name_pali: string | null;
    credits: number;
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
