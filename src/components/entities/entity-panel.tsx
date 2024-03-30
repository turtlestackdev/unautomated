import type { z, ZodType } from 'zod';
import React, { cloneElement, type ReactElement, type ReactNode, useState } from 'react';
import { PlusIcon } from '@heroicons/react/16/solid';
import { type DeleteAction, deleteSchema, type FormAction } from '@/lib/validation';
import type { Entity } from '@/entities/types';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { CollapsibleSection } from '@/components/layout/collapsible-section';
import { H1, Text } from '@/components/text';
import { Button } from '@/components/button';

interface EntityConstructorProps<T extends ZodType, M extends Entity> {
  isEmpty: boolean;
  records: M[];
  onClickAdd: () => void;
  onClickEdit: (record: M) => void;
  onClickDelete: (record: M) => void;
  isSaveDialogOpen: boolean;
  onCloseSaveDialog: () => void;
  isDeleteDialogOpen: boolean;
  onCloseDeleteDialog: () => void;
  recordToSave: M | undefined;
  recordToDelete: M | undefined;
  submitSave: (event: React.FormEvent<HTMLFormElement>) => void;
  saveErrors: z.inferFlattenedErrors<T> | null;
  submitDelete: (event: React.FormEvent<HTMLFormElement>) => void;
  deleteErrors: z.inferFlattenedErrors<typeof deleteSchema> | null;
}

interface EntityPanelProps<T extends ZodType, M extends Entity> {
  records: M[];
  schema: T;
  saveAction: FormAction<T, M>;
  deleteAction: DeleteAction;
  title: string;
  show?: boolean;

  children: (props: EntityConstructorProps<T, M>) => React.JSX.Element;
}

export function EntityPanel<T extends ZodType, M extends Entity>(
  props: EntityPanelProps<T, M>
): React.JSX.Element {
  const [records, setRecords] = useState(props.records);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [recordToSave, setRecordToSave] = useState<M | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<M | undefined>(undefined);

  const onClickAdd = (): void => {
    setRecordToSave(undefined);
    setIsSaveDialogOpen(true);
  };

  const onClickEdit = (record: M): void => {
    setRecordToSave(record);
    setIsSaveDialogOpen(true);
  };

  const onClickDelete = (record: M): void => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const onCloseSaveDialog = (): void => {
    setIsSaveDialogOpen(false);
    setRecordToSave(undefined);
  };

  const onCloseDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false);
    //setRecordToDelete(undefined);
  };

  const onCreate = (created: M): void => {
    setRecords([...records, created]);
  };

  const onEdit = (edited: M): void => {
    setRecords(records.map((record) => (record.id === edited.id ? edited : record)));
  };

  const onDelete = ({ id }: Entity): void => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const { onSubmit: submitSave, errors: saveErrors } = useFormSubmit({
    schema: props.schema,
    action: props.saveAction,
    onSuccess: (record: M) => {
      setIsSaveDialogOpen(false);
      recordToSave ? onEdit(record) : onCreate(record);
      setRecordToSave(undefined);
    },
  });

  const { onSubmit: submitDelete, errors: deleteErrors } = useFormSubmit({
    schema: deleteSchema,
    action: props.deleteAction,
    onSuccess: (record) => {
      setIsDeleteDialogOpen(false);
      onDelete(record);
      setRecordToDelete(undefined);
    },
  });

  return (
    <CollapsibleSection title={props.title} show={props.show}>
      {props.children({
        isEmpty: records.length === 0,
        records,
        onClickAdd,
        onClickEdit,
        onClickDelete,
        isSaveDialogOpen,
        onCloseSaveDialog,
        isDeleteDialogOpen,
        onCloseDeleteDialog,
        recordToSave,
        recordToDelete,
        submitSave,
        saveErrors,
        submitDelete,
        deleteErrors,
      })}
    </CollapsibleSection>
  );
}

interface EmptyPanelProps {
  headline: string;
  children: ReactNode;
  btnText: string;
  onAdd: () => void;
  Icon: ReactElement<React.SVGProps<SVGSVGElement> & { primary?: string; secondary?: string }>;
}

export function EntityPanelEmptyState(props: EmptyPanelProps): React.JSX.Element {
  const Icon = cloneElement(props.Icon, {
    className: 'h-96 w-96 text-gray-200',
    primary: 'fill-gray-200',
    secondary: 'fill-transparent stroke-gray-200',
  });
  return (
    <div className="relative w-full overflow-hidden py-20">
      <div className=" relative z-10 max-w-fit space-y-12">
        <div>
          <H1 className="mb-4  text-balance">{props.headline}</H1>
          <p className="max-w-80 text-lg/6 text-zinc-700 ">{props.children}</p>
        </div>
        <Button color="brand" onClick={props.onAdd}>
          {props.btnText}
        </Button>
      </div>
      <div className="absolute left-16 top-1/2 z-0 -translate-y-1/2 lg:left-64">{Icon}</div>
    </div>
  );
}

EntityPanel.EmptySate = EntityPanelEmptyState;

interface PanelContentProps {
  description: string;
  onClickAdd: () => void;
  addBtnText: string;
}

export function EntityPanelContent(
  props: React.PropsWithChildren<PanelContentProps>
): React.JSX.Element {
  return (
    <div className="flex grow flex-col space-y-8">
      <div className="grow space-y-8">
        <div className="flex items-center gap-4">
          <Text className="max-w-prose">{props.description}</Text>
          <div className="hidden grow text-right sm:block">
            <Button plain onClick={props.onClickAdd}>
              <PlusIcon />
              Add
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 ">{props.children}</div>
      </div>
      <div className="sticky bottom-0 shrink sm:hidden">
        <div className="h-full grow bg-green-200">
          <Button color="brand" className="w-full" onClick={props.onClickAdd}>
            <PlusIcon /> {props.addBtnText}
          </Button>
        </div>
      </div>
    </div>
  );
}

EntityPanel.Content = EntityPanelContent;
