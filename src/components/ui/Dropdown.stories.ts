import type { Meta, StoryObj } from '@storybook/vue3';
import Dropdown from './Dropdown.vue';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Edit', action: () => console.log('Edit clicked') },
      { label: 'Delete', action: () => console.log('Delete clicked') },
      { label: 'Share', action: () => console.log('Share clicked') },
    ],
  },
};

export const WithDescriptions: Story = {
  args: {
    trigger: 'Settings',
    items: [
      { 
        label: 'Profile', 
        action: () => console.log('Profile clicked'),
        description: 'Manage your profile settings'
      },
      { 
        label: 'Security', 
        action: () => console.log('Security clicked'),
        description: 'Change password and security options'
      },
      { 
        label: 'Notifications', 
        action: () => console.log('Notifications clicked'),
        description: 'Configure notification preferences'
      },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    trigger: 'Actions',
    items: [
      { label: 'Save', action: () => console.log('Save clicked') },
      { label: 'Publish', action: () => console.log('Publish clicked'), disabled: true },
      { label: 'Archive', action: () => console.log('Archive clicked') },
    ],
  },
};

export const TopPlacement: Story = {
  args: {
    trigger: 'Menu',
    placement: 'top',
    items: [
      { label: 'Option 1', action: () => console.log('Option 1 clicked') },
      { label: 'Option 2', action: () => console.log('Option 2 clicked') },
    ],
  },
};

export const CustomTrigger: Story = {
  args: {
    items: [
      { label: 'Edit', action: () => console.log('Edit clicked') },
      { label: 'Delete', action: () => console.log('Delete clicked') },
    ],
  },
  render: (args) => ({
    components: { Dropdown },
    setup() {
      return { args };
    },
    template: `
      <Dropdown v-bind="args">
        <template #trigger>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>⚙️</span>
            <span>Settings</span>
          </div>
        </template>
      </Dropdown>
    `,
  }),
};

export const AutoPositioning: Story = {
  args: {
    items: [
      { label: 'Item 1', action: () => console.log('Item 1 clicked') },
      { label: 'Item 2', action: () => console.log('Item 2 clicked') },
      { label: 'Item 3', action: () => console.log('Item 3 clicked') },
      { label: 'Item 4', action: () => console.log('Item 4 clicked') },
      { label: 'Item 5', action: () => console.log('Item 5 clicked') },
    ],
  },
  render: (args) => ({
    components: { Dropdown },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 100vh; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="padding: 20px;">
          <Dropdown v-bind="args">
            <template #trigger>
              <div style="padding: 8px 16px; background: #e5e7eb; border-radius: 4px;">
                Top Dropdown
              </div>
            </template>
          </Dropdown>
        </div>
        
        <div style="padding: 20px;">
          <Dropdown v-bind="args">
            <template #trigger>
              <div style="padding: 8px 16px; background: #e5e7eb; border-radius: 4px;">
                Bottom Dropdown
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    `,
  }),
};
