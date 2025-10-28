import { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Image, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Resource {
  resource_number: number;
  title: string;
  category: string;
  description: string;
  link: string;
  thumbnail?: string;
  type?: string;
  authors?: string;
  date?: string;
}

interface Album {
  album_number: number;
  title: string;
  cover_image?: string;
  date?: string;
}

const Home = () => {
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentContent();
  }, []);

  const fetchRecentContent = async () => {
    try {
      // Fetch recent resources
      const resourcesResponse = await fetch(`${backend_url}/get_resources?limit=3`);
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        setRecentResources(resourcesData.resources || []);
      }

      // Fetch recent gallery albums
      const albumsResponse = await fetch(`${backend_url}/get_photo_albums`);
      if (albumsResponse.ok) {
        const albumsData = await albumsResponse.json();
        const albums: Album[] = albumsData.albums || [];
        
        // Get the last 4 albums
        setRecentAlbums(albums.slice(-4).reverse());
      }
    } catch (error) {
      console.error('Error fetching recent content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/EPIChomepage.jpg"
            alt="Rice paddy fields"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-blue-800/50" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EPIC: Equity Perspectives for Irrigation Care or Control?
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Creating knowledge and capacity for socially inclusive and ecologically sustainable irrigation water management            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Learn More About EPIC
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/team"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Video */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Our Project
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Investments in irrigation are primarily driven by the need to enhance agricultural production and efficiency. Ensuring equity in water access is rarely the focus. Yet, by not explicitly accounting for it, irrigation interventions often increase inequity in access. Project EPIC aims to mainstream the focus on equity in irrigation design and practice by creating new knowledge, tools, and capacity to make irrigation more socially inclusive, ecologically just and sustainable. EPIC is a collaborative initiative across partners representing academic institutions, government and non-government bodies from four countries: India, Tanzania, Ethiopia, and the Netherlands.
            </p>
            <p className=" mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Watch this video to learn more about our research, impact, and the communities we work with.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-xl">
                <iframe 
                  src="https://drive.google.com/file/d/1KdZgHGjE1HxxnI5DKQLnVKjwKdLOJyxd/preview" 
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay"
                  title="EPIC Project Video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Project Partners
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Row 1 */}
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/iitd.svg"
                alt="IIT Delhi"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/ihe-delft.png"
                alt="IHE Delft"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/atree.png"
                alt="ATREE"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/fes.svg"
                alt="FES"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Row 2 */}
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/nmaist.png"
                alt="NMAIST"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/pangani.png"
                alt="Pangani Basin Water Board"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/wollo.png"
                alt="Wollo University"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full max-w-[200px] h-32 flex items-center justify-center p-4">
              <img
                src="/logos/wodet.png"
                alt="WoDET"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Funders */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Funders
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Project EPIC is supported by the IHE Delft Water and Development Partnership Programme, financed by the Dutch Ministry of Foreign Affairs
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-[600px] h-40 flex items-center justify-center">
                <img
                  src="/logos/ihe-funding.png"
                  alt="Dutch Ministry of Foreign Affairs"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Project Outputs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Project Outputs</h2>
              <p className="text-lg text-gray-600">
                Explore our recent blogs and academic writings
              </p>
            </div>
            <Link
              to="/resources"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Outputs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent outputs...</p>
            </div>
          ) : recentResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentResources.map((resource) => (
                <a
                  key={resource.resource_number}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Thumbnail */}
                  {resource.thumbnail && (
                    <div className="w-full h-48">
                      <img
                        src={`${backend_url}${resource.thumbnail}`}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {resource.type}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{resource.title}</h3>
                    {resource.authors && (
                      <p className="text-sm text-gray-600 mb-2">By: {resource.authors}</p>
                    )}
                    {resource.date && (
                      <p className="text-sm text-gray-500">{resource.date}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent outputs available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Gallery Photos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Gallery Photos</h2>
              <p className="text-lg text-gray-600">
                Visuals from our field sites and project activities
              </p>
            </div>
            <Link
              to="/gallery"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent albums...</p>
            </div>
          ) : recentAlbums.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentAlbums.map((album) => (
                <Link
                  key={album.album_number}
                  to={`/gallery/${album.album_number}`}
                  className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  {album.cover_image ? (
                    <img
                      src={`${backend_url}${album.cover_image}`}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">{album.title}</p>
                      {album.date && (
                        <p className="text-white/80 text-xs mt-1">{album.date}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent albums available.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;