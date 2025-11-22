import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles (all buttons)
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // Primary: Swedish Blue (systematic action)
        primary: 'bg-swedish-blue text-birch-white hover:bg-swedish-blue-600 focus:ring-swedish-blue dark:bg-swedish-blue-dark dark:hover:bg-swedish-blue-500',
        
        // Secondary: Transparent with border
        secondary: 'bg-transparent border-2 border-swedish-blue text-swedish-blue hover:bg-swedish-blue hover:text-birch-white focus:ring-swedish-blue dark:border-swedish-blue-dark dark:text-swedish-blue-dark',
        
        // Success: Sage Green (growth, positive action)
        success: 'bg-sage-green text-birch-white hover:bg-sage-green-600 focus:ring-sage-green',
        
        // Warning: Thread Gold (caution)
        warning: 'bg-thread-gold text-swedish-blue hover:bg-thread-gold-600 focus:ring-thread-gold dark:bg-thread-gold-dark dark:text-birch-white-dark',
        
        // Danger: Truth Copper (critical action)
        danger: 'bg-truth-copper text-birch-white hover:bg-truth-copper-600 focus:ring-truth-copper dark:bg-truth-copper-dark',
        
        // Alliance: Sacred Alliance Purple (collaborative action)
        alliance: 'bg-alliance-purple text-birch-white hover:bg-alliance-purple-600 focus:ring-alliance-purple dark:bg-alliance-purple-dark',
        
        // Ghost: Minimal styling
        ghost: 'bg-transparent hover:bg-swedish-blue/10 text-swedish-blue focus:ring-swedish-blue dark:text-swedish-blue-dark dark:hover:bg-swedish-blue-dark/10',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

