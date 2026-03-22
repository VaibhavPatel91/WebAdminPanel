import { Box, Typography, Grid, Paper, Stack, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Package, Layers, MessageSquare, TrendingUp, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';

const ModernStatCard = ({ title, value, icon: Icon, color, loading, subtitle }) => (
  <Paper
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: `${color}.main`,
      },
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: 'none',
      background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`,
    }}
  >
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 1, fontSize: '0.7rem' }}>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
        {loading ? <CircularProgress size={24} /> : value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Paper>
);

const CategoryCard = ({ category }) => (
  <Paper
    sx={{
      p: 2.5,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: 'none',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'scale(1.02)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        '& .arrow-icon': { transform: 'translateX(4px)', color: 'primary.main' }
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{
        p: 1.2,
        borderRadius: 2.5,
        bgcolor: 'primary.lighter',
        color: 'primary.main',
        display: 'flex'
      }}>
        <Layers size={20} />
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {category.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 5,
        mt: 2
      }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2, display: 'flex' }}>
              <LayoutDashboard size={20} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
              Dashboard
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Hello Admin, here's what's happening today.
          </Typography>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <ModernStatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={Package}
            color="primary"
            loading={isLoading}
            subtitle="View and manage catalog"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ModernStatCard
            title="Active Categories"
            value={stats?.totalCategories || 0}
            icon={Layers}
            color="secondary"
            loading={isLoading}
            subtitle="Organized classifications"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ModernStatCard
            title="Recent Inquiries"
            value={stats?.totalInquiries || 0}
            icon={MessageSquare}
            color="warning"
            loading={isLoading}
            subtitle="Customer messages"
          />
        </Grid>
      </Grid>

      {/* Content Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
              Category Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Comprehensive breakdown of your inventory by category.
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
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
              gap: 2.5
            }}
          >
            {stats?.categoryStats?.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
            {(!stats?.categoryStats || stats.categoryStats.length === 0) && (
              <Paper sx={{ gridColumn: '1 / -1', p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'grey.50', border: '2px dashed', borderColor: 'divider' }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                  No category data available yet.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
