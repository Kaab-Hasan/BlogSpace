import React, { useState } from 'react';
import {
  Box,
  Card,
  Toolbar,
  IconButton,
  Divider,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';

const EditorCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: '1px solid #e5e7eb',
  overflow: 'hidden'
}));

const EditorToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: '#f9fafb',
  borderBottom: '1px solid #e5e7eb',
  minHeight: 48,
  padding: theme.spacing(0, 2),
  gap: theme.spacing(1)
}));

const ToolbarButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  border: 'none',
  backgroundColor: 'transparent',
  color: '#4b5563',
  fontSize: '14px',
  fontWeight: 400,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  }
}));

const EditorContent = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    border: 'none',
    borderRadius: 0,
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none'
    }
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(3),
    fontSize: '16px',
    fontFamily: 'Segoe UI Symbol',
    color: '#000000',
    minHeight: 300,
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1
    }
  }
}));

const VerticalDivider = styled(Divider)({
  height: 24,
  backgroundColor: '#d1d5db'
});

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start writing your article...'
}) => {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const handleFormatToggle = (format: string) => {
    setActiveFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const formatButtons = [
    { id: 'bold', label: 'B', title: 'Bold' },
    { id: 'italic', label: 'I', title: 'Italic' },
    { id: 'underline', label: 'U', title: 'Underline' }
  ];

  const headingButtons = [
    { id: 'h1', label: 'H1', title: 'Heading 1' },
    { id: 'h2', label: 'H2', title: 'Heading 2' },
    { id: 'h3', label: 'H3', title: 'Heading 3' }
  ];

  const listButtons = [
    { id: 'bullet', label: '•', title: 'Bullet List' },
    { id: 'number', label: '1.', title: 'Numbered List' },
    { id: 'quote', label: '""', title: 'Quote' }
  ];

  return (
    <EditorCard>
      <EditorToolbar>
        {formatButtons.map((button) => (
          <ToolbarButton
            key={button.id}
            className={activeFormats.includes(button.id) ? 'active' : ''}
            onClick={() => handleFormatToggle(button.id)}
            title={button.title}
          >
            {button.label}
          </ToolbarButton>
        ))}
        
        <VerticalDivider orientation="vertical" flexItem />
        
        {headingButtons.map((button) => (
          <ToolbarButton
            key={button.id}
            className={activeFormats.includes(button.id) ? 'active' : ''}
            onClick={() => handleFormatToggle(button.id)}
            title={button.title}
          >
            {button.label}
          </ToolbarButton>
        ))}
        
        <VerticalDivider orientation="vertical" flexItem />
        
        {listButtons.map((button) => (
          <ToolbarButton
            key={button.id}
            className={activeFormats.includes(button.id) ? 'active' : ''}
            onClick={() => handleFormatToggle(button.id)}
            title={button.title}
          >
            {button.label}
          </ToolbarButton>
        ))}
        
        <VerticalDivider orientation="vertical" flexItem />
        
        <ToolbarButton
          className={activeFormats.includes('link') ? 'active' : ''}
          onClick={() => handleFormatToggle('link')}
          title="Insert Link"
        >
          🔗
        </ToolbarButton>
      </EditorToolbar>
      
      <EditorContent
        multiline
        fullWidth
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
      />
    </EditorCard>
  );
};

export default RichTextEditor;