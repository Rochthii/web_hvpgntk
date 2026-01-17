export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    EDUCATION: '/education',
    NEWS: '/tin-tuc',
    NEWS_DETAIL: '/tin-tuc/:slug',
    ADMISSIONS: '/tuyen-sinh',
    CONTACT: '/lien-he',
    STUDENT_PORTAL: '/cong-thong-tin',
    SCHEDULE: '/student/schedule',
    GRADES: '/student/grades',
    REGISTRATION: '/student/registration',
    MY_REQUESTS: '/student/requests',
    CREATE_REQUEST: '/student/requests/create',
    PROFILE: '/profile',
    PORTAL: {
        CONTENT: '/portal/content',
        CONTENT_NEWS: '/portal/content/news',
        CONTENT_NEWS_CREATE: '/portal/content/news/create',
        TEACHER: '/portal/teacher',
        TEACHER_CLASSES: '/portal/teacher/classes',
        TEACHER_GRADES: '/portal/teacher/grades',
        TEACHER_STUDENTS: '/portal/teacher/students',
    }
};

export const API_ROUTES = {
    CMS: {
        SETTINGS: '/cms/settings/',
        PAGES: '/cms/pages/',
        NEWS: '/cms/news/',
        STAFF: '/cms/staff/',
    },
    ACADEMIC: {
        COURSES: '/academic/courses/',
        YEARS: '/academic/years/',
    }
};
