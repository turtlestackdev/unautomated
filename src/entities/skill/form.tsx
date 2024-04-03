import React, { useState } from 'react';
import { clsx } from 'clsx';
import { type Selectable } from 'kysely';
import { PlusIcon } from '@heroicons/react/16/solid';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Input as HeadlessInput, Select as HeadlessSelect } from '@headlessui/react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDroppable,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { FormProps } from '@/lib/validation';
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Button, Submit, TouchTarget } from '@/components/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog';
import { type skillSchema } from '@/entities/skill/validation';
import { type SkillGroup } from '@/entities/skill/types';
import { type Skill } from '@/database/schema';
import DragHandle from '@/icons/drag-handle.svg';

type SkillFormProps = FormProps<typeof skillSchema, SkillGroup>;

export function SkillForm({
  record,
  onSubmit,
  errors,
  onCancel,
  includeActions = true,
  className,
  ...props
}: SkillFormProps): React.JSX.Element {
  return (
    <form onSubmit={onSubmit} className={clsx(className, 'space-y-8')} {...props}>
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Category</Label>
            <Input defaultValue={record?.name} name="name" errors={errors?.fieldErrors.name} />
          </Field>
          <SkillSetFields skills={record?.skills ?? []} />

          {record?.id ? <input defaultValue={record.id} name="id" type="hidden" /> : null}
        </FieldGroup>
      </Fieldset>
      {includeActions ? (
        <div className="flex place-content-end gap-2">
          {onCancel ? (
            <Button plain onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Submit color="brand">Save</Submit>
        </div>
      ) : null}
    </form>
  );
}

export function SkillFormDialog({
  open,
  onClose,
  ...props
}: Omit<SkillFormProps, 'includeActions'> & {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const formId = `skill-form-dialog-${props.record?.id ?? 'new'}`;

  return (
    <Dialog open={open} onClose={onClose} size="lg">
      <DialogTitle>{props.record ? 'Edit skill category' : 'Add skill category'}</DialogTitle>
      <DialogBody>
        <SkillForm {...props} includeActions={false} id={formId} />
        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Submit color="brand" form={formId}>
            Save
          </Submit>
        </DialogActions>
      </DialogBody>
    </Dialog>
  );
}

interface SkillInputProps {
  key: string;
  id?: string;
  name: string;
  level: number;
}

function SkillSetFields(props: { skills: Selectable<Skill>[] }): React.JSX.Element {
  const emptySkill = (): { name: string; level: number; key: string } => {
    return {
      key: `${new Date().getTime() * Math.random()}`,
      name: '',
      level: 3,
    };
  };
  const [activeSkill, setActiveSkill] = useState<SkillInputProps | undefined>(undefined);
  const [activeSkillState, setActiveSkillState] = useState<'dragging' | 'pendingDelete'>(
    'dragging'
  );
  const [skills, setSkills] = useState<SkillInputProps[]>(
    props.skills.length === 0
      ? [emptySkill()]
      : props.skills.map((skill) => {
          return { ...skill, key: skill.id };
        })
  );

  const deleteId = 'delete-skill-drop-area';
  const updateSkill = (updated: SkillInputProps): void => {
    setSkills(skills.map((skill) => (skill.key === updated.key ? updated : skill)));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragEndEvent): void => {
    const { active } = event;

    setActiveSkill(skills.find((skill) => skill.key === active.id));
    setActiveSkillState('dragging');
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over) {
      if (over.id === deleteId) {
        setSkills(skills.filter((skill) => skill.key !== active.id));
      } else if (active.id !== over.id) {
        setSkills((items) => {
          const oldIndex = items.findIndex((skill) => skill.key === active.id);
          const newIndex = items.findIndex((skill) => skill.key === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }

    setActiveSkill(undefined);
    setActiveSkillState('dragging');
  };

  const handleDragOver = (event: DragOverEvent): void => {
    const { over } = event;
    if (over && over.id === deleteId) {
      setActiveSkillState('pendingDelete');
    } else {
      setActiveSkillState('dragging');
    }
  };

  return (
    <fieldset>
      <legend
        className="select-none text-base/6 font-medium text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
        data-slot="label"
      >
        Skills
      </legend>
      <div className="-mt-8 text-right">
        <Button
          plain
          className="text-sm"
          onClick={() => {
            setSkills([...skills, emptySkill()]);
          }}
        >
          <PlusIcon className="fill-brand-500" /> <span className="text-brand-500">Add skill</span>
        </Button>
      </div>
      <div className="mt-2">
        <div className="space-y-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <ul className="space-y-4">
              <SortableContext
                items={skills.map((skill) => skill.key)}
                strategy={verticalListSortingStrategy}
              >
                {skills.map((skill, index) => (
                  <SkillInputs
                    key={skill.key}
                    skill={skill}
                    sortOrder={index}
                    onChange={updateSkill}
                    state={activeSkill?.key === skill.key ? activeSkillState : 'normal'}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeSkill ? (
                  <SkillInputsOverlay
                    skill={activeSkill}
                    pendingDelete={activeSkillState === 'pendingDelete'}
                  />
                ) : null}
              </DragOverlay>
            </ul>
            <DeleteZone id={deleteId} />
          </DndContext>
        </div>
      </div>
    </fieldset>
  );
}

function DeleteZone({ id }: { id: string }): React.JSX.Element {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'mx-auto rounded bg-gray-200  p-4 text-center shadow-well',
        isOver ? 'border border-dashed border-red-600' : 'border border-transparent'
      )}
    >
      <TrashIcon
        className={clsx('mx-auto mt-2 h-8 w-8 ', isOver ? 'fill-red-600' : 'fill-gray-400')}
      />
      <span className={clsx(isOver ? 'text-red-600' : 'text-gray-700')}>Drag to delete skills</span>
    </div>
  );
}

function SkillHandle({
  listeners,
  pendingDelete = false,
}: {
  listeners?: SyntheticListenerMap;
  pendingDelete?: boolean;
}): React.JSX.Element {
  return (
    <div
      {...listeners}
      className={clsx(
        pendingDelete ? 'cursor-not-allowed' : '',
        // prevent scrolling
        'touch-none',
        // Basic layout
        'relative z-30 block',

        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        'before:absolute before:inset-px before:rounded-l-[calc(theme(borderRadius.lg)-1px)]  before:shadow',

        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        'dark:before:hidden',

        // Focus ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-t-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-brand-500',

        // Disabled state
        'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',

        // Invalid state
        'before:has-[[data-invalid]]:shadow-red-500/10'
      )}
    >
      <div className={clsx('flex h-full items-center rounded-none rounded-l-lg bg-amber-200')}>
        <TouchTarget>
          <DragHandle className="h-6 w-6 fill-amber-400" />
        </TouchTarget>
      </div>
    </div>
  );
}

function SkillInputGroup({
  skill,
  onChange,
}: {
  skill: SkillInputProps;
  onChange?: (skill: SkillInputProps) => void;
}): React.JSX.Element {
  const setName = (event: React.FormEvent<HTMLInputElement>): void => {
    onChange && onChange({ ...skill, name: event.currentTarget.value });
  };

  const setLevel = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange && onChange({ ...skill, level: parseInt(event.currentTarget.value) });
  };

  const disabled = onChange === undefined;

  return (
    <div className="grow -space-y-px" data-slot="control">
      <div>
        <label htmlFor="skill_name[]" className="sr-only">
          Skill
        </label>
        <span
          className={clsx([
            // Basic layout
            'relative block w-full',

            // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
            'before:absolute before:inset-px before:rounded-tr-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',

            // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
            'dark:before:hidden',

            // Focus ring
            'after:pointer-events-none after:absolute after:inset-0 after:rounded-tr-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-brand-500',

            // Disabled state
            'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',

            // Invalid state
            'before:has-[[data-invalid]]:shadow-red-500/10',
          ])}
        >
          <HeadlessInput
            className={clsx([
              // Basic layout
              'relative block w-full appearance-none rounded-none rounded-tr-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',

              // Typography
              'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',

              // Border
              'border border-l-0 border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',

              // Background color
              'bg-transparent dark:bg-white/5',

              // Hide default focus styles
              'focus:outline-none',

              // Invalid state
              'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500',

              // Disabled state
              'data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',
            ])}
            name="skill_name[]"
            placeholder="Skill"
            value={skill.name}
            onChange={setName}
            disabled={disabled}
          />
        </span>
      </div>
      <div>
        <label htmlFor="skill_level[]" className="sr-only">
          Level
        </label>
        <span
          className={clsx([
            // Basic layout
            'group relative block w-full',

            // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
            'before:absolute before:inset-px before:rounded-br-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',

            // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
            'dark:before:hidden',

            // Focus ring
            'after:pointer-events-none after:absolute after:inset-0 after:rounded-br-lg after:ring-inset after:ring-transparent sm:after:has-[[data-focus]]:ring-2 sm:after:has-[[data-focus]]:ring-brand-500',

            // Disabled state
            'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',
          ])}
        >
          <HeadlessSelect
            name="skill_level[]"
            value={skill.level}
            onChange={setLevel}
            disabled={disabled}
            className={clsx([
              // Basic layout
              'relative block w-full appearance-none rounded-none rounded-br-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',

              // Horizontal padding
              'pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.10)-1px)] sm:pl-[calc(theme(spacing.3)-1px)] sm:pr-[calc(theme(spacing.9)-1px)]',

              // Options (multi-select)
              '[&_optgroup]:font-semibold',

              // Typography
              'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white',

              // Border
              'border border-l-0 border-t-0 border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',

              // Background color
              'bg-transparent dark:bg-white/5 dark:*:bg-zinc-800',

              // Hide default focus styles
              'focus:outline-none',

              // Invalid state
              'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600',

              // Disabled state
              'data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',
            ])}
          >
            <option value={1}>Beginner</option>
            <option value={2}>Intermediate</option>
            <option value={3}>Proficient</option>
            <option value={4}>Advanced</option>
            <option value={5}>Expert</option>
          </HeadlessSelect>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              aria-hidden="true"
              className="size-5 stroke-zinc-500 group-has-[[data-disabled]]:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.75 10.75L8 13L10.25 10.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
              <path
                d="M10.25 5.25L8 3L5.75 5.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
}

function SkillInputs({
  skill,
  onChange,
  state,
  sortOrder,
}: {
  skill: SkillInputProps;
  sortOrder: number;
  onChange: (skill: SkillInputProps) => void;
  state: 'normal' | 'dragging' | 'pendingDelete';
}): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: skill.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} className="relative z-20">
      <div
        className={clsx(
          state === 'normal' ? 'hidden' : '',
          state === 'pendingDelete' ? 'bg-red-200' : 'bg-blue-50',
          'absolute z-40 h-full w-full rounded-lg shadow-well'
        )}
      />
      <div className={clsx(state !== 'normal' ? 'invisible' : '', 'flex -space-x-px')}>
        <SkillHandle listeners={listeners} />
        <SkillInputGroup skill={skill} onChange={onChange} />
      </div>
      <input type="hidden" name="skill_sort_order[]" value={sortOrder} />
      <input type="hidden" name="skill_id[]" value={skill.id} />
    </li>
  );
}

function SkillInputsOverlay({
  skill,
  pendingDelete,
}: {
  skill: SkillInputProps;
  pendingDelete: boolean;
}): React.JSX.Element {
  return (
    <div
      className={clsx(
        'relative z-20 rounded-lg',
        pendingDelete ? 'bg-red-100 opacity-85 shadow-2xl shadow-red-200' : 'bg-white'
      )}
    >
      <div className="flex -space-x-px">
        <SkillHandle pendingDelete={pendingDelete} />
        <SkillInputGroup skill={skill} />
      </div>
    </div>
  );
}
