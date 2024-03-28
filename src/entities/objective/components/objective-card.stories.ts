import type { Meta, StoryObj } from '@storybook/react';
import { type Selectable } from 'kysely';
import { ObjectiveCard } from '@/entities/objective/components/objective-card';
import { type ResumeObjective } from '@/database/schema';
import { type deleteSchema, type FormResponse } from '@/lib/validation';
import { type objectiveSchema } from '@/entities/objective/validation';
import { noop } from '@/lib/utils';
import { isString } from '@/lib/type-guards';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Entities/Objective/Card',
  component: ObjectiveCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof ObjectiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const objective: Selectable<ResumeObjective> = {
  id: '123',
  user_id: '456',
  name: 'Primary',
  objective:
    ' Best practices horsehead offer, and killing it cannibalize, pipeline design thinking. ' +
    "A set of certitudes based on deductions founded on false premise let's put a pin in that. " +
    'Going forward get all your ducks in a row bake it in, or iâ€™ve been doing some research this morning and ' +
    'we need to better, and they have downloaded gmail and seems to be working for now.',
  is_default: true,
};

export const Primary: Story = {
  args: {
    objective,
    editAction: (_data) => {
      return new Promise<FormResponse<typeof objectiveSchema, Selectable<ResumeObjective>>>(
        (resolve) => {
          resolve({ status: 'success', model: objective });
        }
      );
    },
    onEdit: noop,
    deleteAction: (data) => {
      return new Promise<FormResponse<typeof deleteSchema, string>>((resolve) => {
        const id = data.get('id');
        if (isString(id)) {
          resolve({ status: 'success', model: id });
        } else {
          resolve({ status: 'error', errors: { formErrors: [], fieldErrors: { id: ['bad id'] } } });
        }
      });
    },
    onDelete: noop,
  },
};
