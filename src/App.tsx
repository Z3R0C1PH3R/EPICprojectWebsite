import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Team from './pages/Team';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import GalleryAlbumDetail from './pages/GalleryAlbumDetail';
import NotFound from './pages/NotFound';

// Admin imports
import AdminPortal from './pages/admin/AdminPortal';
import CaseStudiesAdmin from './pages/admin/CaseStudiesAdmin';
import ResourcesAdmin from './pages/admin/ResourcesAdmin';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import TeamAdmin from './pages/admin/TeamAdmin';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:caseStudyNumber" element={<CaseStudyDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:albumNumber" element={<GalleryAlbumDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/case-studies" element={<CaseStudiesAdmin />} />
            <Route path="/admin/resources" element={<ResourcesAdmin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
            <Route path="/admin/team" element={<TeamAdmin />} />
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;