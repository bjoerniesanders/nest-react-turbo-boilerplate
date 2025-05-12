import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  CardContent,
  InputAdornment,
  IconButton,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  const handleLogin = async () => {
    setError(null);
    try {
      await auth.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--content-50)',
        py: 8,
        display: 'flex',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'var(--brand-primary-500)',
              py: 4,
              px: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'var(--base-white)',
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              Welcome back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--base-white)',
                opacity: 0.8,
              }}
            >
              Please sign in to continue
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'var(--brand-primary-500)' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'var(--brand-primary-500)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="py-3"
                onClick={handleLogin}
                aria-label="Sign in to your account"
              >
                Sign in
              </Button>
            </Box>
            {error && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: 'var(--accent-danger-500)',
                  mt: 3,
                  p: 2,
                  bgcolor: 'var(--accent-danger-50)',
                  borderRadius: 1,
                }}
              >
                {error}
              </Typography>
            )}
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
}
