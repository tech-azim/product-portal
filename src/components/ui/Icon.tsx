import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export default function Icon({ name, size = 18, className = '', ...props }: IconProps) {
  const IconComponent = (LucideIcons[name] as React.ElementType) || LucideIcons.HelpCircle;

  return <IconComponent size={size} className={`shrink-0 ${className}`.trim()} {...props} />;
}
