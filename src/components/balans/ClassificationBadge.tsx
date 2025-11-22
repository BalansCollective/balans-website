import { HTMLAttributes, forwardRef } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { EyeIcon, CodeBracketIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export type ClassificationLevel = 'public' | 'internal' | 'private' | 'protected' | 'critical';
export type SensitivityType = 'what' | 'how';

interface ClassificationBadgeProps extends HTMLAttributes<HTMLDivElement> {
  level: ClassificationLevel;
  sensitivity?: SensitivityType;
  explanation?: string;
  children?: React.ReactNode;
}

const classificationStyles = {
  public: {
    border: 'border-l-4 border-swedish-blue',
    bg: 'bg-swedish-blue/5 dark:bg-swedish-blue-dark/10',
    text: 'text-swedish-blue dark:text-swedish-blue-dark',
    label: 'PUBLIC',
    icon: <InformationCircleIcon className="w-4 h-4" />,
  },
  internal: {
    border: 'border-l-4 border-[#2c7d6e]',
    bg: 'bg-[#2c7d6e]/5 dark:bg-[#4dd0e1]/10',
    text: 'text-[#2c7d6e] dark:text-[#4dd0e1]',
    label: 'INTERNAL',
    icon: <InformationCircleIcon className="w-4 h-4" />,
  },
  private: {
    border: 'border-l-4 border-thread-gold',
    bg: 'bg-thread-gold/5 dark:bg-thread-gold-dark/10',
    text: 'text-thread-gold dark:text-thread-gold-dark',
    label: 'PRIVATE',
    icon: <InformationCircleIcon className="w-4 h-4" />,
  },
  protected: {
    border: 'border-l-4 border-[#d2691e]',
    bg: 'bg-[#d2691e]/5 dark:bg-[#ffb366]/10',
    text: 'text-[#d2691e] dark:text-[#ffb366]',
    label: 'PROTECTED',
    icon: <InformationCircleIcon className="w-4 h-4" />,
  },
  critical: {
    border: 'border-l-4 border-truth-copper',
    bg: 'bg-truth-copper/5 dark:bg-truth-copper-dark/10',
    text: 'text-truth-copper dark:text-truth-copper-dark',
    label: 'CRITICAL',
    icon: <InformationCircleIcon className="w-4 h-4" />,
  },
};

const defaultExplanations: Record<ClassificationLevel, string> = {
  public: 'Public information - accessible to everyone, no restrictions.',
  internal: 'Internal information - restricted to authorized personnel within the organization.',
  private: 'Private information - personal or sensitive data with limited access.',
  protected: 'Protected information - cannot be modified in certain states, requires guardian approval.',
  critical: 'Critical information - requires immediate attention, highest security level.',
};

export const ClassificationBadge = forwardRef<HTMLDivElement, ClassificationBadgeProps>(
  ({ level, sensitivity, explanation, children, className, ...props }, ref) => {
    const style = classificationStyles[level];
    const SensitivityIcon = sensitivity === 'what' ? EyeIcon : CodeBracketIcon;

    return (
      <Popover className="relative">
        <PopoverButton
          ref={ref}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
            'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
            style.border,
            style.bg,
            style.text,
            `focus:ring-${level}`,
            className
          )}
          {...props}
        >
          {sensitivity && <SensitivityIcon className="w-4 h-4" />}
          {style.icon}
          <span className="uppercase tracking-wide">{style.label}</span>
          {children}
        </PopoverButton>

        <PopoverPanel className="absolute z-10 mt-2 w-80 rounded-lg bg-birch-white dark:bg-bg-elevated shadow-lg border border-gentle-silver dark:border-gentle-silver/20 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {style.icon}
              <h4 className="font-semibold text-swedish-blue dark:text-swedish-blue-dark">
                {style.label}
              </h4>
            </div>
            <p className="text-sm text-gentle-silver-700 dark:text-gentle-silver-400">
              {explanation || defaultExplanations[level]}
            </p>
            {sensitivity && (
              <div className="pt-2 border-t border-gentle-silver/20">
                <p className="text-xs text-gentle-silver-600 dark:text-gentle-silver-500">
                  <strong>Sensitivity:</strong> {sensitivity === 'what' ? 'WHAT (Capability)' : 'HOW (Implementation)'}
                </p>
              </div>
            )}
          </div>
        </PopoverPanel>
      </Popover>
    );
  }
);

ClassificationBadge.displayName = 'ClassificationBadge';

