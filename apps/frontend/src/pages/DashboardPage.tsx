import type { MouseEvent } from "react";
import { use, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Container,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/Authservice";

export default function DashboardPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const auth = use(AuthContext);
  const navigate = useNavigate();

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
     AuthService.logout()
    } catch (err) {
      console.warn("Logout failed", err);
    }
  
    auth?.logout();
    navigate("/login");
  };

  const stats = [
    {
      title: "Users",
      value: "1,234",
      icon: <PeopleIcon sx={{ color: 'var(--brand-primary-500)' }} />,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Activities",
      value: "456",
      icon: <AssessmentIcon sx={{ color: 'var(--brand-primary-500)' }} />,
      change: "+8%",
      trend: "up",
    },
    {
      title: "Growth",
      value: "23%",
      icon: <TrendingUpIcon sx={{ color: 'var(--brand-primary-500)' }} />,
      change: "+5%",
      trend: "up",
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--content-50)' }}>
      {/* Navigation */}
      <Paper
        elevation={2}
        sx={{
          bgcolor: 'var(--base-white)',
          mb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DashboardIcon sx={{ color: 'var(--brand-primary-500)', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--brand-primary-500)' }}>
                Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton>
                <NotificationsIcon />
              </IconButton>
              <IconButton onClick={handleMenu}>
                <Avatar sx={{ bgcolor: 'var(--brand-primary-500)' }}>U</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <SettingsIcon sx={{ mr: 1 }} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          {stats.map((stat) => (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'var(--brand-primary-50)',
                        borderRadius: 1,
                        display: 'flex',
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" sx={{ ml: 2, color: 'var(--content-900)' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.trend === "up" ? 'var(--accent-success-500)' : 'var(--accent-danger-500)',
                    }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: 'var(--brand-primary-500)' }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {/* Recent Activity */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'var(--content-900)' }}>
                Recent Activities
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'var(--content-50)',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'var(--brand-primary-50)',
                        borderRadius: '50%',
                        display: 'flex',
                      }}
                    >
                      <AssessmentIcon sx={{ color: 'var(--brand-primary-500)' }} />
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: 'var(--content-900)' }}>
                        Activity {item}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--content-500)' }}>
                        {item} hours ago
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 