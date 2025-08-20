import type { Meta, StoryObj } from '@storybook/vue3';
import Avatar from './Avatar.vue';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://via.placeholder.com/150',
    alt: 'User profile',
  },
};
