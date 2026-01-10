import client from './client';
import { AcademicYear, Semester, Course, Class, Enrollment, Grade } from '../types/academic';

export const academicApi = {
    // Years & Semesters
    getAcademicYears: () => client.get<AcademicYear[]>('/academic/years/'),
    getCurrentYear: () => client.get<AcademicYear>('/academic/years/current/'),
    getSemesters: (yearId?: string) => client.get<Semester[]>('/academic/semesters/', { params: { year: yearId } }),
    getCurrentSemester: () => client.get<Semester>('/academic/semesters/current/'),

    // Courses & Classes
    getCourses: () => client.get<Course[]>('/academic/courses/'),
    getClasses: (semesterId?: string) => client.get<Class[]>('/academic/classes/', { params: { semester: semesterId } }),
    getClassDetail: (id: string) => client.get<Class>(`/academic/classes/${id}/`),

    // Student Specific (My Data)
    getMyEnrollments: () => client.get<Enrollment[]>('/academic/enrollments/my_enrollments/'),
    getMyGrades: () => client.get<any[]>('/academic/student/grades/'),

    // Registration
    getAvailableClasses: () => client.get<any[]>('/academic/registration/available-classes/'),
    enrollClass: (classId: number) => client.post('/academic/registration/enroll/', { class_id: classId }),
    unenrollClass: (classId: number) => client.delete(`/academic/registration/unenroll/${classId}/`),

    // Dashboard Stats
    getStudentStats: () => client.get('/academic/student/stats/'),
    getMySchedule: () => client.get<any[]>('/academic/student/schedule/'),
};

