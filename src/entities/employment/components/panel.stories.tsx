import type { Meta, StoryObj } from '@storybook/react';
import { EmploymentPanel } from '@/entities/employment/components/panel';
import { type Employment } from '@/entities/employment/types';
import {
  type DeleteAction,
  type DeleteResponse,
  type FormAction,
  type FormResponse,
  formToObject,
} from '@/lib/validation';
import { employmentSchema } from '@/entities/employment/validation';
import { isString } from '@/lib/type-guards';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Entities/Employment/Panel',
  component: EmploymentPanel,
  decorators: (Story) => (
    <div className="mx-auto flex w-full max-w-7xl grow flex-col items-start gap-x-8 bg-gray-100 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
      <Story />
    </div>
  ),
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof EmploymentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const saveAction: FormAction<typeof employmentSchema, Employment> = (data) => {
  return new Promise<FormResponse<typeof employmentSchema, Employment>>((resolve) => {
    const request = employmentSchema.safeParse(formToObject(data));
    if (!request.success) {
      resolve({ status: 'error', errors: request.error.flatten() });
    } else {
      const model = request.data;
      const id = model.id ?? '123';
      resolve({
        status: 'success',
        model: {
          ...model,
          id,
          start_date: model.start_date ? new Date(model.start_date) : null,
          end_date: model.end_date ? new Date(model.end_date) : null,
          user_id: '123',
          highlights: model.highlights.map((highlight, index) => {
            return { description: highlight, job_id: id, id, index };
          }),
        },
      });
    }
  });
};

const deleteAction: DeleteAction = (data) => {
  return new Promise<DeleteResponse>((resolve) => {
    const id = data.get('id');
    if (isString(id)) {
      resolve({ status: 'success', model: { id } });
    } else {
      resolve({ status: 'error', errors: { formErrors: [], fieldErrors: { id: ['bad id'] } } });
    }
  });
};

export const EmptyState: Story = {
  args: {
    employment: [],
    saveAction,
    deleteAction,
  },
};

const employment: Employment[] = [
  {
    id: '123',
    user_id: 'abc',
    company: 'ABC Company, Inc.',
    title: 'Full Stack Java Developer',
    start_date: new Date('2018-06-07'),
    end_date: null,
    is_current_position: true,
    description: '',
    highlights: [
      {
        id: '123',
        job_id: '123',
        description:
          'Developed scalable, robust, and maintainable enterprise-level applications using Java and Spring Boot',
      },
      {
        id: '456',
        job_id: '123',
        description:
          'Used Angular for developing dynamic and responsive web front-ends, improving user experience by 30',
      },
      {
        id: '789',
        job_id: '123',
        description:
          'Integrated applications with MySQL and MongoDB databases to store and retrieve data efficiently',
      },
      {
        id: '012',
        job_id: '123',
        description:
          'Collaborated in an Agile development team to deliver high-quality software every sprint',
      },
      {
        id: '345',
        job_id: '123',
        description: 'Created RESTful services and APIs for frontend and third-party applications',
      },
      {
        id: '678',
        job_id: '123',
        description:
          'Wrote unit tests using Junit and Mockito for robust testing of application components',
      },
    ],
  },
  {
    id: '456',
    user_id: 'abc',
    company: 'XYZ Solutions',
    title: 'Software Developer',
    start_date: new Date('2016-07-01'),
    end_date: new Date('2018-06-01'),
    is_current_position: false,
    description: '',
    highlights: [
      {
        id: '098',
        job_id: '456',
        description:
          'Participated in the complete software development life cycle from requirement analysis to deployment',
      },
      {
        id: '765',
        job_id: '456',
        description:
          'Implemented business logic using Java and enhanced user interface using Angular',
      },
      {
        id: '432',
        job_id: '456',
        description:
          'Developed and maintained SQL and NoSQL databases, implementing complex queries for business needs',
      },
      {
        id: '109',
        job_id: '456',
        description:
          'Utilized Git for version control and collaborated with team members via GitHub',
      },
      {
        id: '876',
        job_id: '456',
        description: 'Assisted in troubleshooting, software debugging, and system enhancements',
      },
    ],
  },
];

export const WorkHistory: Story = {
  args: {
    employment,
    saveAction,
    deleteAction,
  },
};
