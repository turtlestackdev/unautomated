import React, { forwardRef, type ReactElement, useRef, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { Field, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

export function ListField(props: {
  items: string[];
  name?: string;
  label: string;
  onChange?: (items: string[]) => void;
}): React.JSX.Element {
  const ref = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(props.items);
  const itemRefs = useRef<HTMLInputElement[]>([]);
  const pushItemRef = (el: HTMLInputElement): void => {
    itemRefs.current.push(el);
  };

  const addItem = (): void => {
    if (ref.current?.value.trim()) {
      setItems([ref.current.value.trim(), ...items]);
      if (props.onChange) {
        props.onChange(items);
      }

      ref.current.value = '';
    }
  };

  const updateItem = (index: number, value: string): void => {
    const current = items[index];
    if (current && current !== value) {
      setItems(items.toSpliced(index, 1, value.trim()));

      if (props.onChange) {
        props.onChange(items);
      }
    }
  };

  const removeItem = (index: number): void => {
    const item = itemRefs.current[index];
    if (item) {
      item.value = '';
    }
    setItems(items.toSpliced(index, 1));

    if (props.onChange) {
      props.onChange(items);
    }
  };

  const moveUp = (index: number): void => {
    if (index > 0) {
      const up = items[index];
      const upRef = itemRefs.current[index];
      const down = items[index - 1];
      const downRef = itemRefs.current[index - 1];

      if (up !== undefined && down !== undefined) {
        setItems(items.toSpliced(index - 1, 2, up, down));
        if (upRef && downRef) {
          upRef.value = down;
          downRef.value = up;
        }
      }

      if (props.onChange) {
        props.onChange(items);
      }
    }
  };

  const moveDown = (index: number): void => {
    if (index < items.length - 1) {
      const up = items[index + 1];
      const upRef = itemRefs.current[index + 1];
      const down = items[index];
      const downRef = itemRefs.current[index];

      if (up !== undefined && down !== undefined) {
        setItems(items.toSpliced(index, 2, up, down));
        if (upRef && downRef) {
          upRef.value = down;
          downRef.value = up;
        }
      }

      if (props.onChange) {
        props.onChange(items);
      }
    }
  };

  return (
    <>
      <Field>
        <Label>{props.label}</Label>
        <div className="mt-3 flex gap-2">
          <Input name={props.name ? `${props.name}[]` : undefined} ref={ref} />
          <Button color="brand" onClick={addItem}>
            <PlusIcon />
          </Button>
        </div>
      </Field>
      {items.map((item, index) => (
        <ListItem
          item={item}
          key={item}
          name={props.name}
          onChange={(value) => {
            updateItem(index, value);
          }}
          onDelete={() => {
            removeItem(index);
          }}
          onMoveDown={
            index < items.length - 1
              ? () => {
                  moveDown(index);
                }
              : undefined
          }
          onMoveUp={
            index > 0
              ? () => {
                  moveUp(index);
                }
              : undefined
          }
          ref={pushItemRef}
        />
      ))}
    </>
  );
}

const ListItem = forwardRef(function ListItem(
  {
    ...props
  }: {
    item: string;
    name?: string;
    onChange?: (value: string) => void;
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
  },
  ref: React.ForwardedRef<HTMLInputElement>
): ReactElement {
  return (
    <Field>
      <div className="mt-3 flex gap-2">
        <Input
          defaultValue={props.item}
          name={props.name ? `${props.name}[]` : undefined}
          onBlur={(event) => {
            props.onChange && props.onChange(event.target.value);
          }}
          ref={ref}
        />
        {props.onMoveUp ? (
          <Button color="light" onClick={props.onMoveUp}>
            <ArrowUpIcon />
          </Button>
        ) : null}
        {props.onMoveDown ? (
          <Button color="light" onClick={props.onMoveDown}>
            <ArrowDownIcon />
          </Button>
        ) : null}
        <Button
          color="light"
          onClick={() => {
            props.onDelete && props.onDelete();
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    </Field>
  );
});
