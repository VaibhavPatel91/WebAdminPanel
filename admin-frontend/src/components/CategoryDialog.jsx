import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const CategoryDialog = ({ open, category, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name || '' },
  });

  React.useEffect(() => {
    if (open) {
      reset({ name: category?.name || '' });
      setImagePreview(category?.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/${category.image}` : null);
      setSelectedFile(null);
    }
  }, [category, open, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Category Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <Box sx={{ position: 'relative', width: '100%', height: 160, borderRadius: 2, overflow: 'hidden' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, p: 0.5 }}
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </Button>
                </Box>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Upload size={20} />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ height: 160, borderStyle: 'dashed', borderRadius: 2 }}
                >
                  Upload Image
                </Button>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save Category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
