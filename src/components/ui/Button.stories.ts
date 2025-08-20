import type { Meta, StoryObj } from '@storybook/vue3';
import Button from './Button.vue';
import { 
  Search, 
  Rocket, 
  ArrowRight, 
  Plus, 
  Cog, 
  Check,
  ExclamationTriangle,
  Times
} from '@vicons/fa';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'text', 'dashed'],
    },
    severity: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: { type: 'select' },
      options: ['default', 'full', 'none'],
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base stories
export const Primary: Story = {
  args: {
    variant: 'filled',
    severity: 'primary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Primary Button</Button>',
  }),
};

export const SecondaryGray: Story = {
  args: {
    variant: 'filled',
    severity: 'secondary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Secondary Button</Button>',
  }),
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    severity: 'primary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Outlined Button</Button>',
  }),
};

export const Text: Story = {
  args: {
    variant: 'text',
    severity: 'primary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Text Button</Button>',
  }),
};

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    severity: 'primary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Dashed Button</Button>',
  }),
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Small Button</Button>',
  }),
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Large Button</Button>',
  }),
};

// States
export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Loading Button</Button>',
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Disabled Button</Button>',
  }),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    icon: Search,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args"></Button>',
  }),
};

export const WithIcon: Story = {
  args: {
    icon: Rocket,
    iconPosition: 'left',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Button with Icon</Button>',
  }),
};

export const WithRightIcon: Story = {
  args: {
    icon: ArrowRight,
    iconPosition: 'right',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Continue</Button>',
  }),
};

export const Fluid: Story = {
  args: {
    fluid: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Full Width Button</Button>',
  }),
};

// Severity variants
export const Info: Story = {
  args: {
    severity: 'info',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Info Button</Button>',
  }),
};

export const Success: Story = {
  args: {
    severity: 'success',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Success Button</Button>',
  }),
};

export const Warning: Story = {
  args: {
    severity: 'warning',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Warning Button</Button>',
  }),
};

export const Error: Story = {
  args: {
    severity: 'error',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Error Button</Button>',
  }),
};

// Rounded variants
export const RoundedFull: Story = {
  args: {
    rounded: 'full',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Rounded Button</Button>',
  }),
};

export const RoundedNone: Story = {
  args: {
    rounded: 'none',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Square Button</Button>',
  }),
};

// Icon showcase
export const IconShowcase: Story = {
  render: () => ({
    components: { Button },
    setup() {
      return {
        icons: [
          { icon: Search, label: 'Search' },
          { icon: Rocket, label: 'Launch' },
          { icon: Plus, label: 'Add' },
          { icon: Cog, label: 'Settings' },
          { icon: Check, label: 'Confirm' },
          { icon: ExclamationTriangle, label: 'Warning' },
          { icon: Times, label: 'Close' },
        ]
      };
    },
    template: `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Icon Variants</h3>
        <div class="flex flex-wrap gap-3">
          <Button 
            v-for="item in icons" 
            :key="item.label"
            :icon="item.icon"
            iconPosition="left"
            variant="filled"
            severity="primary"
          >
            {{ item.label }}
          </Button>
        </div>
      </div>
    `,
  }),
};

// Mixed icon types showcase
export const MixedIconTypes: Story = {
  render: () => ({
    components: { Button },
    setup() {
      return {
        iconExamples: [
          { icon: Search, label: 'Search Icon' },
          { icon: Rocket, label: 'Launch Icon' },
          { icon: Plus, label: 'Add Icon' },
          { icon: Cog, label: 'Settings Icon' },
        ]
      };
    },
    template: `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Vue Component Icons</h3>
        <p class="text-sm text-gray-600">All icons are Vue components from @vicons/fa</p>
        <div class="space-y-3">
          <div v-for="item in iconExamples" :key="item.label" class="flex items-center gap-3">
            <Button 
              :icon="item.icon"
              iconPosition="left"
              variant="outlined"
              severity="primary"
              size="sm"
            >
              {{ item.label }}
            </Button>
          </div>
        </div>
      </div>
    `,
  }),
};
