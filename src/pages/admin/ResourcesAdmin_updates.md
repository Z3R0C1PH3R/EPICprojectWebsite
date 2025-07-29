// Add import at the top
import { ImagePreview } from '../../components/ImagePreview';

// Add sections state variables after existing ones
const [numSections, setNumSections] = useState(1);
const [sections, setSections] = useState([{ image: null, heading: '', body: '' }]);
const [sectionQualities, setSectionQualities] = useState<number[]>([80]);
const [originalSectionImages, setOriginalSectionImages] = useState<(File | null)[]>([]);
const [existingSectionImages, setExistingSectionImages] = useState<string[]>([]);
const [link, setLink] = useState('');

// Add section helper functions
const handleSectionImageSelect = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    const newOriginalImages = [...originalSectionImages];
    newOriginalImages[index] = file;
    setOriginalSectionImages(newOriginalImages);
    
    const compressed = await compressImage(file, sectionQualities[index] || 80);
    handleSectionChange(index, 'image', compressed);
  }
};

const handleSectionChange = (index: number, field: string, value: any) => {
  const newSections = [...sections];
  newSections[index] = { ...newSections[index], [field]: value };
  setSections(newSections);
};

const updateSectionCount = (count: number) => {
  const newCount = Math.max(1, count);
  setNumSections(newCount);
  setSections(current => {
    if (newCount > current.length) {
      return [...current, ...Array(newCount - current.length).fill({ image: null, heading: '', body: '' })];
    }
    return current.slice(0, newCount);
  });
  setSectionQualities(current => {
    if (newCount > current.length) {
      return [...current, ...Array(newCount - current.length).fill(80)];
    }
    return current.slice(0, newCount);
  });
};

// In handleEditResource function, add section handling:
if (resource.sections && resource.sections.length > 0) {
  setNumSections(resource.sections.length);
  setExistingSectionImages(resource.sections.map((section: any) => section.image || ''));
  setSections(resource.sections.map((section: any) => ({
    image: null,
    heading: section.heading || '',
    body: section.body || '',
    existingImage: section.image
  })));
}

// In handleSubmit function, add sections to form data:
sections.forEach((section, index) => {
  if (section.image) {
    formData.append(`section_${index}_image`, section.image);
  } else if (editingResource) {
    formData.append(`section_${index}_existing_image`, existingSectionImages[index] || '');
  }
  formData.append(`section_${index}_heading`, section.heading);
  formData.append(`section_${index}_body`, section.body);
});

// Add link field to form data:
formData.append('link', link);

// Add link input field in the form:
<div>
  <label className="block text-sm font-medium mb-2">
    External Link (Optional)
  </label>
  <input
    type="url"
    value={link}
    onChange={(e) => setLink(e.target.value)}
    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

// Add sections form fields:
<div>
  <label className="block text-sm font-medium mb-2">Number of Sections</label>
  <input
    type="number"
    min="1"
    value={numSections}
    onChange={(e) => updateSectionCount(parseInt(e.target.value))}
    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{sections.map((section, index) => (
  <div key={index} className="mb-8 p-4 border border-gray-300 rounded-lg">
    <h3 className="text-lg font-medium mb-4">Section {index + 1}</h3>
    
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Section Image (Optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleSectionImageSelect(index, e)}
        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {section.image && (
        <div className="mt-4">
          <ImagePreview file={section.image} className="max-h-32 w-auto" showSize={true} />
        </div>
      )}
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Section Heading</label>
      <input
        type="text"
        value={section.heading}
        onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Section Body</label>
      <textarea
        value={section.body}
        onChange={(e) => handleSectionChange(index, 'body', e.target.value)}
        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 min-h-[100px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
))}

// Update file input to show preview with size:
{resourceFile && (
  <div className="mt-4">
    <ImagePreview file={resourceFile} className="max-h-32 w-auto" showSize={true} />
  </div>
)}