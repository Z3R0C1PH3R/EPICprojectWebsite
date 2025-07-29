// Fixed handleSubmit function for ResourcesAdmin
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!resourceFile && !editingResource) {
    alert('Please select a resource file');
    return;
  }
  
  if (!resourceNumber || !title) {
    alert('Please fill in resource number and title');
    return;
  }

  setIsSubmitting(true);
  
  try {
    const formData = new FormData();
    formData.append('resource_number', resourceNumber);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('link', link);
    
    if (resourceFile) {
      formData.append('resource_file', resourceFile);
    }

    if (editingResource) {
      formData.append('is_edit', 'true');
    }

    // Add sections to form data
    sections.forEach((section, index) => {
      if (section.image) {
        formData.append(`section_${index}_image`, section.image);
      } else if (editingResource) {
        formData.append(`section_${index}_existing_image`, existingSectionImages[index] || '');
      }
      formData.append(`section_${index}_heading`, section.heading);
      formData.append(`section_${index}_body`, section.body);
    });

    const response = await fetch(backend_url + '/upload_resource', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    alert('Upload successful!');
    fetchExistingResources();
    setShowNewForm(false);
    
    // Clear form
    setResourceFile(null);
    setResourceNumber('');
    setTitle('');
    setType('');
    setDescription('');
    setLink('');
    setEditingResource(null);
    setNumSections(1);
    setSections([{ image: null, heading: '', body: '' }]);
    setSectionQualities([80]);
    setOriginalSectionImages([]);
    setExistingSectionImages([]);
    
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading resource: ' + (error as Error).message);
  } finally {
    setIsSubmitting(false);
  }
};