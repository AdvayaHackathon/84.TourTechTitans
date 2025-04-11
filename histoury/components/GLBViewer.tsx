
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface Model {
  id: string;
  title: string;
  location: string;
}

// Sample model data mapping place slugs to model IDs
const MODEL_MAPPING: Record<string, string> = {
  "ajanta-caves": "d916f1bc949c4284ab3fe56ddbfe660d",
  "ellora-caves": "1a5ec1e212f9451e80dc051e97164d17",
  "hawa-mahal": "8f5d2468d33c423cbe0b63aa189ee8ce",
  "gateway-of-india": "38a652e9f3bf49039026ef65ef61ac92",
  "khajuraho": "dd99586619e74f24b8dec10cc009c360",
  "sun-temple-konark": "dbb5c50a2eff4fdc82b50555c74672ef",
  "charminar": "7e345500b4034e448d2ffcd9b03e3241",
  "golden-temple": "6b40ad464ccb402b99c311413875c860",
  "lotus-temple": "0a81d18db3c947fbbdc8d60edd1ef323",
  "mysore-palace": "0439ee6964c94a10bf9767088469bb94",
  "qutub-minar": "e165e25ec8f1497aa83ab72419f40ddc",
  "victoria-memorial": "1b3ec6a1a07949d08221f718fd1919d4"
};

// Sample model data - you can replace this with your actual model IDs
const SAMPLE_MODELS: Model[] = [
  { id: "297b9caec4e94b02b210eeeafffbd790", title: "Eiffel Tower", location: "Paris, France" },
  { id: "df4b6e9a25474ae9927fdb01f33ba561", title: "Pyramids of Giza", location: "Egypt" },
  { id: "535dc96e586f40bd956ea3cbff810055", title: "Colosseum", location: "Rome, Italy" },
  { id: "d02e8cdef15946408be6613fc5d1f0ff", title: "Taj Mahal", location: "Agra, India" },
  { id: "8401e1c10480476e8d7e3085d1aec923", title: "Statue of Liberty", location: "New York, USA" },
  { id: "90d53b3cb4b042ce845a24baa679109e", title: "Christ the Redeemer", location: "Rio de Janeiro, Brazil" },
  { id: "d916f1bc949c4284ab3fe56ddbfe660d", title: "Ajanta Caves", location: "Maharashtra, India" },
  { id: "1a5ec1e212f9451e80dc051e97164d17", title: "Ellora Caves", location: "Aurangabad, India" },
  { id: "8f5d2468d33c423cbe0b63aa189ee8ce", title: "Hawa Mahal", location: "Jaipur, India" },
  { id: "38a652e9f3bf49039026ef65ef61ac92", title: "Gateway of India", location: "Mumbai, India" },
  { id: "dd99586619e74f24b8dec10cc009c360", title: "Khajuraho", location: "Madhya Pradesh, India" },
  { id: "dbb5c50a2eff4fdc82b50555c74672ef", title: "Sun Temple Konark", location: "Odisha, India" },
  { id: "7e345500b4034e448d2ffcd9b03e3241", title: "Charminar", location: "Hyderabad, India" },
  { id: "6b40ad464ccb402b99c311413875c860", title: "Golden Temple", location: "Punjab, India" },
  { id: "0a81d18db3c947fbbdc8d60edd1ef323", title: "Lotus Temple", location: "Delhi, India" },
  { id: "0439ee6964c94a10bf9767088469bb94", title: "Mysore Palace", location: "Karnataka, India" },
  { id: "e165e25ec8f1497aa83ab72419f40ddc", title: "Qutub Minar", location: "New Delhi, India" },
  { id: "1b3ec6a1a07949d08221f718fd1919d4", title: "Victoria Memorial", location: "Kolkata, India" },
];

export interface GLBViewerProps {
  placeSlug: string;
  initialModelId?: string;
  height?: string;
}

export default function GLBViewer({ placeSlug, initialModelId, height = "70vh" }: GLBViewerProps) {
  // Find initial model based on slug or use provided initialModelId
  const getInitialModel = (): Model => {
    if (placeSlug && MODEL_MAPPING[placeSlug]) {
      const modelId = MODEL_MAPPING[placeSlug];
      const foundModel = SAMPLE_MODELS.find(m => m.id === modelId);
      if (foundModel) return foundModel;
    }
    
    if (initialModelId) {
      const foundModel = SAMPLE_MODELS.find(m => m.id === initialModelId);
      if (foundModel) return foundModel;
    }
    
    return SAMPLE_MODELS[0];
  };

  // State for the current model
  const [selectedModel, setSelectedModel] = useState<Model>(getInitialModel());
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModels, setFilteredModels] = useState<Model[]>(SAMPLE_MODELS);
  
  // Filter models based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredModels(SAMPLE_MODELS);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = SAMPLE_MODELS.filter(
        model => model.title.toLowerCase().includes(query) || model.location.toLowerCase().includes(query)
      );
      setFilteredModels(filtered);
    }
  }, [searchQuery]);

  // Handle model selection
  const selectModel = (model: Model) => {
    setSelectedModel(model);
    setSearchOpen(false);
    setIsLoading(true);
    setIframeLoaded(false);
  };

  // Handle iframe loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        setIsLoading(false); // Assume it's loaded after timeout as a fallback
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [iframeLoaded, selectedModel]);

  // Function to handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIsLoading(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    if (!searchOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Main 3D Viewer */}
      <div className="w-full h-full relative overflow-hidden rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white mt-4 text-lg font-medium">Loading {selectedModel.title}...</p>
              <p className="text-gray-400 mt-2">Preparing your 3D experience</p>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          title={`${selectedModel.title}`}
          frameBorder="0"
          allowFullScreen 
          className="w-full h-full"
          src={`https://sketchfab.com/models/${selectedModel.id}/embed?ui_inspector=0&ui_annotations=0&ui_infos=0&ui_controls=0&ui_watermark=0&ui_help=0&ui_fullscreen=1`}
          onLoad={handleIframeLoad}
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>

      {/* Search Bar */}
      <div id="search-container" className="absolute top-4 right-4 z-20">
        {/* Search Toggle Button */}
        {!searchOpen ? (
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center bg-black bg-opacity-75 backdrop-blur-sm px-3 py-2 rounded-lg text-white hover:bg-opacity-90 transition"
          >
            <Search size={16} className="mr-2" />
            <span>Explore More Landmarks</span>
          </button>
        ) : (
          <div className="bg-black bg-opacity-75 backdrop-blur-sm p-4 rounded-xl w-72 shadow-xl border border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search landmark names..."
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            
            {/* Search Results */}
            <div className="mt-3 max-h-64 overflow-y-auto">
              {filteredModels.length > 0 ? (
                filteredModels.map(model => (
                  <div 
                    key={model.id}
                    onClick={() => selectModel(model)}
                    className="p-2 hover:bg-gray-800 rounded cursor-pointer transition"
                  >
                    <div className="text-white font-medium">{model.title}</div>
                    <div className="text-gray-400 text-sm">{model.location}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">No landmarks found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Info Panel */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 backdrop-blur-sm p-3 rounded-xl text-white max-w-xs shadow-xl border border-gray-700">
        <div className="flex items-center">
          <span className="mr-2">💡</span> 
          <span>Click and drag to rotate • Scroll to zoom • Right-click to pan</span>
        </div>
      </div>
    </div>
  );
}