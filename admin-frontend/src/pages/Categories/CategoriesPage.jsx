import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import { Plus, Search, MoreVertical, Edit2, Trash2, Layers } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import CategoryDialog from '../../components/CategoryDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSnackbar } from 'notistack';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const imageUrl = category.image
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/${category.image}`
    : 'https://via.placeholder.com/200?text=No+Image';

  return (
    <Paper
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderColor: 'primary.main',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 180 }}>
        <Box
          component="img"
          src={imageUrl}
          alt={category.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'white' },
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          >
            <MoreVertical size={18} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2.5, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }} noWrap>
          {category.name}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: 2,
            minWidth: 140,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
          }
        }}
      >
        <MenuItem onClick={() => { onEdit(category); handleClose(); }} sx={{ py: 1, gap: 1.5 }}>
          <Edit2 size={16} />
          <Typography variant="body2" fontWeight={600}>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={() => { onDelete(category._id); handleClose(); }} sx={{ color: 'error.main', py: 1, gap: 1.5 }}>
          <Trash2 size={16} />
          <Typography variant="body2" fontWeight={600}>Delete</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const saveMutation = useMutation({
    mutationFn: (values) => selectedCategory
      ? categoryService.update(selectedCategory._id, values)
      : categoryService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      enqueueSnackbar(`Category ${selectedCategory ? 'updated' : 'created'} successfully`, { variant: 'success' });
      handleCloseDialog();
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || 'Error saving category', { variant: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      enqueueSnackbar('Category deleted successfully', { variant: 'success' });
      setConfirmDelete(null);
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || 'Error deleting category', { variant: 'error' });
    }
  });

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedCategory(null);
    setDialogOpen(false);
  };

  const filteredCategories = data?.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage product categories and classifications.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Category
        </Button>
      </Box>

      {/* Toolbar Section */}
      <Box sx={{ mb: 5 }}>
        <TextField
          size="medium"
          placeholder="Search categories across your catalog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 450,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '&:hover fieldset': { borderColor: 'primary.main' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={22} style={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Grid Section */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={50} thickness={4} />
        </Box>
      ) : filteredCategories?.length === 0 ? (
        <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, bgcolor: 'grey.50', border: '2px dashed', borderColor: 'divider' }}>
          <Typography color="text.secondary" fontWeight={600}>No categories found matching your search.</Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)'
            },
            gap: 3
          }}
        >
          {filteredCategories?.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={handleOpenDialog}
              onDelete={(id) => setConfirmDelete(id)}
            />
          ))}
        </Box>
      )}

      {/* Dialogs */}
      <CategoryDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={handleCloseDialog}
        onSave={(vals) => saveMutation.mutateAsync(vals)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      />
    </Box>
  );
};

export default CategoriesPage;
