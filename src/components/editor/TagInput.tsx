import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

const TagContainer = styled(Box)({
  marginTop: '8px'
});

const TagChip = styled(Chip)(({ theme }) => ({
  fontSize: '13.23px',
  fontWeight: 400,
  color: '#4b5563',
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  '& .MuiChip-deleteIcon': {
    color: '#6b7280',
    fontSize: '16px'
  }
}));

const TagTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.common.white,
    '& fieldset': {
      border: '1px solid #e5e7eb'
    }
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
    color: '#9ca3af',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1
    }
  }
}));

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add tags (press Enter to add)'
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      
      if (!value.includes(newTag)) {
        onChange?.([...value, newTag]);
      }
      
      setInputValue('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    onChange?.(value.filter(tag => tag !== tagToDelete));
  };

  return (
    <Box>
      <TagTextField
        fullWidth
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        variant="outlined"
        size="small"
      />
      
      {value.length > 0 && (
        <TagContainer>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {value.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                size="small"
              />
            ))}
          </Stack>
        </TagContainer>
      )}
    </Box>
  );
};

export default TagInput;