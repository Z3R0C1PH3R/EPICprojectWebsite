import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Team from './pages/Team';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Gallery from './pages/Gallery';
import GalleryAlbumDetail from './pages/GalleryAlbumDetail';

// Admin imports
import AdminPortal from './pages/admin/AdminPortal';
import CaseStudiesAdmin from './pages/admin/CaseStudiesAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import ResourcesAdmin from './pages/admin/ResourcesAdmin';
import GalleryAdmin from './pages/admin/GalleryAdmin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:caseStudyNumber" element={<CaseStudyDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventNumber" element={<EventDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:resourceNumber" element={<ResourceDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:albumNumber" element={<GalleryAlbumDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/case-studies" element={<CaseStudiesAdmin />} />
            <Route path="/admin/events" element={<EventsAdmin />} />
            <Route path="/admin/resources" element={<ResourcesAdmin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;