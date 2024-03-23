import type { Meta, StoryObj } from '@storybook/react';
import { type Selectable } from 'kysely';
import type { ZodType, ZodTypeDef } from 'zod';
import { type ResumeObjective } from '@/database/schema';
import { type FormState } from '@/lib/validation';
import { type objectiveSchema } from '@/entities/objective/validation';
import { noop } from '@/lib/utils';
import { ListView } from '@/entities/objective/components/list-view';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Entities/Objective/ListView',
  component: ListView,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof ListView>;

export default meta;
type Story = StoryObj<typeof meta>;

const objectives: Selectable<ResumeObjective>[] = [
  {
    id: '123',
    user_id: '456',
    name: 'Primary',
    objective:
      'Best practices horsehead offer, and killing it cannibalize, pipeline design thinking. ' +
      "A set of certitudes based on deductions founded on false premise let's put a pin in that. " +
      'Going forward get all your ducks in a row bake it in, or iâ€™ve been doing some research this morning and ' +
      'we need to better, and they have downloaded gmail and seems to be working for now.',
    is_default: true,
  },
  {
    id: '456',
    user_id: '456',
    name: 'Another',
    objective:
      'We want to empower the team with the right tools and guidance to uplevel our craft and build better back to ' +
      'the drawing-board. We need evergreen content what about scaling components to a global audience? gain traction, ' +
      'and move the needle hit the ground running, you gotta smoke test your hypothesis, or are we in agreeance. ' +
      "Quantity we've got kpis for that i dont care if you got some copy, " +
      'why you dont use officeipsumcom or something like that ?',
    is_default: false,
  },
  {
    id: '789',
    user_id: '456',
    name: 'Third One',
    objective:
      'Three-martini lunch prioritize these line items, onward and upward, productize the deliverables and ' +
      'focus on the bottom line we need more paper, for critical mass, and that ipo will be a game-changer. ' +
      'Turn the ship going forward get buy-in, so we need to build it so that it scales, ' +
      'and we should leverage existing asserts that ladder up to the message pro-sumer software, nor cadence. ' +
      'Quick sync. Draft policy ppml proposal staff engagement c-suite, so we just need to put these ' +
      'last issues to bed, yet game-plan.',
    is_default: false,
  },
];

export const Primary: Story = {
  args: {
    objectives,
    saveAction: (_prev, _data) => {
      return new Promise<FormState<typeof objectiveSchema, Selectable<ResumeObjective>>>(
        (resolve) => {
          resolve({ status: 'new' });
        }
      );
    },
    onSave: noop,
    deleteAction: (_prev, _data) => {
      return new Promise<FormState<ZodType<null, ZodTypeDef, null>, null>>((resolve) => {
        resolve({ status: 'new' });
      });
    },
    onDelete: noop,
  },
};
