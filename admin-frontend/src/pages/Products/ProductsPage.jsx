import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { productService } from '../../services/product.service';
import ProductDialog from '../../components/ProductDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSnackbar } from 'notistack';

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Table state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: ['products', pagination.pageIndex, pagination.pageSize, globalFilter],
    queryFn: () =>
      productService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: (values) =>
      selectedProduct
        ? productService.update(selectedProduct._id, values)
        : productService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      enqueueSnackbar(
        `Product ${selectedProduct ? 'updated' : 'created'} successfully`,
        { variant: 'success' }
      );
      handleCloseDialog();
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || 'Error saving product', {
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      setConfirmDelete(null);
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || 'Error deleting product', {
        variant: 'error',
      });
    },
  });

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Product Name',
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        Cell: ({ renderedCellValue }) => `$${renderedCellValue}`,
      },
      {
        accessorKey: 'is_online',
        header: 'Status',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? 'Online' : 'Offline'}
            color={cell.getValue() ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: { showColumnFilters: false },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    rowCount: data?.length || 0, // Should be total count from API
    state: {
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Edit2 size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => setConfirmDelete(row.original._id)}
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTablePaperProps: {
      sx: {
        borderRadius: 3,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        bgcolor: 'grey.50',
        fontWeight: 600,
      },
    },
  });

  return (
    <Box>
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
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your product catalog and inventory.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>

      <MaterialReactTable table={table} />

      <ProductDialog
        open={dialogOpen}
        product={selectedProduct}
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

export default ProductsPage;

