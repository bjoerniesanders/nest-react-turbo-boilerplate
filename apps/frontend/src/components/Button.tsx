import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button as MuiButton, CircularProgress } from '@mui/material';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({
  onClick,
  children,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  className = '',
  icon,
  loading = false,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <MuiButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      onClick={onClick}
      startIcon={!loading && icon ? icon : undefined}
      disabled={loading}
      className={`!rounded-md !shadow !transition-all ${
        fullWidth ? '!w-full' : ''
      } ${className}`}
      sx={{
        '&.MuiButton-root': {
          backgroundColor: 'var(--brand-primary-500)',
          '&:hover': {
            backgroundColor: 'var(--brand-primary-700)',
          },
          color: 'var(--base-white)',
        },
      }}
      {...props}
    >
      {loading ? <CircularProgress size={24} /> : children}
    </MuiButton>
  );
}
