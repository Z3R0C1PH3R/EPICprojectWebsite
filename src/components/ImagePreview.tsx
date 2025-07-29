import { useState, useEffect } from 'react';

interface ImagePreviewProps {
  file?: File;
  url?: string;
  className?: string;
  showSize?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  file, 
  url, 
  className = "", 
  showSize = false 
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Format file size
      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      setFileSize(formatFileSize(file.size));
    } else if (url) {
      setImageSrc(url);
    }
  }, [file, url]);

  if (!imageSrc) return null;

  return (
    <div className="space-y-2">
      <img
        src={imageSrc}
        alt="Preview"
        className={`rounded-lg ${className}`}
      />
      {showSize && file && (
        <p className="text-sm text-gray-500">
          Compressed size: {fileSize}
        </p>
      )}
    </div>
  );
};