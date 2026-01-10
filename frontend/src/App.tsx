import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Education from './pages/Education';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Admissions from './pages/Admissions';
import StudentPortal from './pages/StudentPortal';
import Contact from './pages/Contact';
import Schedule from './pages/student/Schedule';
import Grades from './pages/student/Grades';
import CourseRegistration from './pages/student/CourseRegistration';
import MyRequests from './pages/student/MyRequests';
import CreateRequest from './pages/student/CreateRequest';
import MainLayout from './components/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { PetitionQueue } from './pages/admin/PetitionQueue';
import { AdminDashboard } from './pages/admin/dashboard/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ROUTES } from './router/routes';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop />
          <Routes>
            {/* Home handles its own layout for now (special hero spacing etc) */}
            <Route path={ROUTES.HOME} element={<Home />} />

            {/* Student Portal (No MainLayout to avoid double headers) */}
            <Route path={ROUTES.STUDENT_PORTAL} element={<StudentPortal />} />
            <Route path={ROUTES.SCHEDULE} element={<Schedule />} />
            <Route path={ROUTES.GRADES} element={<Grades />} />
            <Route path={ROUTES.REGISTRATION} element={<CourseRegistration />} />
            <Route path={ROUTES.MY_REQUESTS} element={<MyRequests />} />
            <Route path={ROUTES.CREATE_REQUEST} element={<CreateRequest />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/approvals" element={<AdminLayout><PetitionQueue /></AdminLayout>} />

            {/* Other pages use MainLayout (Header + Standard Content + Footer) */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.EDUCATION} element={<Education />} />
              <Route path={ROUTES.NEWS} element={<News />} />
              <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
              <Route path={ROUTES.ADMISSIONS} element={<Admissions />} />
              <Route path={ROUTES.CONTACT} element={<Contact />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;