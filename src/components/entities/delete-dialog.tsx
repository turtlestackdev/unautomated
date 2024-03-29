import React from 'react';
import { type Entity } from '@/entities/types';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog';
import { Button, Submit } from '@/components/button';

interface DeleteProps {
  title: string;
  record: Entity;
  open: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errors: boolean;
}

export function DeleteDialog(props: React.PropsWithChildren<DeleteProps>): React.JSX.Element {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form onSubmit={props.onSubmit}>
        <input type="hidden" name="id" value={props.record.id} />
        <DialogTitle>{props.title}</DialogTitle>
        <DialogBody className="leading-loose">
          {props.errors ? (
            <p className="text-red-700">An error occurred deleting the record</p>
          ) : null}
          {props.children}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={props.onClose}>
            Cancel
          </Button>
          <Submit color="brand">Delete</Submit>
        </DialogActions>
      </form>
    </Dialog>
  );
}
