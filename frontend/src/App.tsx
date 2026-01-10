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
import Profile from './pages/Profile';
import Schedule from './pages/student/Schedule';
import Grades from './pages/student/Grades';
import CourseRegistration from './pages/student/CourseRegistration';
import MyRequests from './pages/student/MyRequests';
import CreateRequest from './pages/student/CreateRequest';
import MainLayout from './components/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { PetitionQueue } from './pages/admin/PetitionQueue';
import { AdminDashboard } from './pages/admin/dashboard/AdminDashboard';
import { NewsList } from './pages/admin/news/NewsList';
import { NewsEditor } from './pages/admin/news/NewsEditor';
import { PageList } from './pages/admin/pages/PageList';
import { PageEditor } from './pages/admin/pages/PageEditor';
import { StaffList } from './pages/admin/staff/StaffList';
import { StaffEditor } from './pages/admin/staff/StaffEditor';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import Unauthorized from './pages/Unauthorized';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Role } from './lib/permissions';
import { SiteSettingsPage } from './pages/admin/settings/SiteSettingsPage';
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

            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ABBOT, Role.TEACHER, Role.CONTENT, Role.SECRETARY, Role.ADMISSION]}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ABBOT, Role.TEACHER, Role.CONTENT, Role.SECRETARY, Role.ADMISSION]}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/approvals" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ABBOT, Role.ADMISSION]}>
                <AdminLayout><PetitionQueue /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* News Management */}
            <Route path="/admin/news" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CONTENT, Role.SECRETARY, Role.TEACHER, Role.ABBOT]}>
                <AdminLayout><NewsList /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/create" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CONTENT]}>
                <AdminLayout><NewsEditor /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/news/edit/:id" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CONTENT]}>
                <AdminLayout><NewsEditor /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Page Management */}
            <Route path="/admin/pages" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CONTENT, Role.SECRETARY]}>
                <AdminLayout><PageList /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/pages/create" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CONTENT]}>
                <AdminLayout><PageEditor /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/pages/edit/:id" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CONTENT]}>
                <AdminLayout><PageEditor /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Staff Management */}
            <Route path="/admin/staff" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AdminLayout><StaffList /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/staff/create" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AdminLayout><StaffEditor /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/staff/edit/:id" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AdminLayout><StaffEditor /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Settings */}
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <AdminLayout><SiteSettingsPage /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Other pages use MainLayout (Header + Standard Content + Footer) */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.EDUCATION} element={<Education />} />
              <Route path={ROUTES.NEWS} element={<News />} />
              <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
              <Route path={ROUTES.ADMISSIONS} element={<Admissions />} />
              <Route path={ROUTES.ADMISSIONS} element={<Admissions />} />
              <Route path={ROUTES.CONTACT} element={<Contact />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;