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
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

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
            <Route path="/" element={<Home />} />

            {/* Other pages use MainLayout (Header + Standard Content + Footer) */}
            <Route element={<MainLayout />}>
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<Education />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/portal" element={<StudentPortal />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;