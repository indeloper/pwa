// Button component types

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'dashed';

export type ButtonSeverity = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonRounded = 'default' | 'full' | 'none';

export type ButtonType = 'button' | 'submit' | 'reset';

export type IconPosition = 'left' | 'right';

export interface ButtonProps {
  variant?: ButtonVariant;
  severity?: ButtonSeverity;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: any; // Vue component only
  iconPosition?: IconPosition;
  iconOnly?: boolean;
  fluid?: boolean;
  rounded?: ButtonRounded;
  type?: ButtonType;
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}
