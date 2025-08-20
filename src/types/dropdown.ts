export interface DropdownItem {
  label: string;
  disabled?: boolean;
  action: () => void;
  description?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: string;
  placement?: 'top' | 'bottom';
}
