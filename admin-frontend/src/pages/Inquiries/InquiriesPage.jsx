import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { inquiryService } from '../../services/inquiry.service';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

const InquiriesPage = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Table state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: [
      'inquiries',
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
    ],
    queryFn: () =>
      inquiryService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: inquiryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['inquiries']);
      enqueueSnackbar('Inquiry deleted successfully', { variant: 'success' });
      setConfirmDelete(null);
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || 'Error deleting inquiry', {
        variant: 'error',
      });
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Date',
        Cell: ({ renderedCellValue }) =>
          renderedCellValue
            ? format(new Date(renderedCellValue), 'MMM dd, yyyy')
            : 'N/A',
      },
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ renderedCellValue }) => (
          <Typography variant="body2" fontWeight={500}>
            {renderedCellValue}
          </Typography>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'message',
        header: 'Message',
        Cell: ({ renderedCellValue }) => (
          <Tooltip title={renderedCellValue}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {renderedCellValue}
            </Typography>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
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
    rowCount: data?.length || 0,
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
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => setConfirmDelete(row.original._id)}
        >
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Inquiries
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage guest inquiries and contact requests.
        </Typography>
      </Box>

      <MaterialReactTable table={table} />

      <ConfirmDialog
        open={!!confirmDelete}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      />
    </Box>
  );
};

export default InquiriesPage;

