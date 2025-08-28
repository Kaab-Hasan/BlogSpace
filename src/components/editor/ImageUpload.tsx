import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card
} from '@mui/material';
import { styled } from '@mui/material/styles';

const UploadCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: '2px dashed #d1d5db',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(46, 90, 46, 0.02)'
  },
  '&.dragover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(46, 90, 46, 0.05)'
  }
}));

const UploadContent = styled(Box)({
  padding: '48px 24px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px'
});

const UploadIcon = styled(Box)({
  width: 22,
  height: 20,
  backgroundColor: '#9ca3af',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  color: 'white'
});

const UploadText = styled(Typography)({
  fontSize: '15.88px',
  fontWeight: 400,
  color: '#4b5563'
});

const UploadSubtext = styled(Typography)({
  fontSize: '14px',
  fontWeight: 400,
  color: '#6b7280'
});

const PreviewImage = styled('img')({
  width: '100%',
  maxHeight: 200,
  objectFit: 'cover',
  borderRadius: 8
});

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null, url: string) => void;
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  placeholder = 'Drag and drop an image here, or click to browse'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreview(url);
        onChange?.(file, url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <UploadCard
        className={isDragOver ? 'dragover' : ''}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadContent>
          {preview ? (
            <PreviewImage src={preview} alt="Preview" />
          ) : (
            <>
              <UploadIcon>📷</UploadIcon>
              <UploadText>{placeholder}</UploadText>
              <UploadSubtext>PNG, JPG, GIF up to 9MB</UploadSubtext>
            </>
          )}
        </UploadContent>
      </UploadCard>
    </Box>
  );
};

export default ImageUpload;