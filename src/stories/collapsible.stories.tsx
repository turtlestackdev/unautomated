import type { Meta, StoryObj } from '@storybook/react';
import { SlideDown } from '@/components/transitions/collapsible';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Entities/Components/SlideDown',
  component: SlideDown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SlideDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    show: true,
    children: <div>I AM A CHILD</div>,
  },
};
