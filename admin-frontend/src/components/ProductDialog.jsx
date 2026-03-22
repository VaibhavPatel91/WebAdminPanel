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
  MenuItem,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { Upload, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.string().refine(val => !isNaN(Number(val)), 'Price must be a number'),
  category: z.string().min(1, 'Category is required'),
  is_online: z.boolean().default(true),
});

const ProductDialog = ({ open, product, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const isEdit = !!product;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    enabled: open,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      is_online: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      const categoryId = product?.category?._id || product?.category || '';
      reset({
        name: product?.name || '',
        price: product?.price?.toString() || '',
        category: typeof categoryId === 'string' ? categoryId : '',
        is_online: product ? !!product.is_online : true,
      });
      setImagePreview(product?.images?.[0] ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/${product.images[0]}` : null);
      setSelectedFile(null);
    }
  }, [product, open, reset]);

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
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('is_online', data.is_online);
      if (selectedFile) {
        formData.append('images', selectedFile);
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Product Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              label="Price ($)"
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Category"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  {categories?.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="is_online"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Show product online"
                />
              )}
            />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Product Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <Box sx={{ position: 'relative', width: '100%', height: 200, borderRadius: 2, overflow: 'hidden' }}>
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
                  sx={{ height: 200, borderStyle: 'dashed', borderRadius: 2 }}
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
            {loading ? <CircularProgress size={24} /> : 'Save Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog;
