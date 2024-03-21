import React from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from '@/hooks/use-session';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog';
import { LoadingIcon } from '@/components/icons/loading-icon';
import { Button, FileButton } from '@/components/button';
import { useFormValidation } from '@/hooks/use-form-validation';
import { uploadResume } from '@/entities/resume/actions';

export function UploadResumeForm({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action } = useFormValidation({
    action: uploadResume.bind(null, user.id),
  });

  return (
    <Dialog onClose={setIsOpen} open={open}>
      <form action={action} ref={formRef}>
        <ResumeUploadInner
          close={() => {
            setIsOpen(false);
          }}
        />
      </form>
    </Dialog>
  );
}

function ResumeUploadInner({ close }: { close: () => void }): React.JSX.Element {
  const { pending } = useFormStatus();
  const upload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const [file] = event.target.files;
      if (file !== undefined) {
        event.target.form?.requestSubmit();
      }
    }
  };

  return (
    <>
      <DialogTitle>Upload your resume</DialogTitle>
      <DialogDescription>
        A single-column resume in PDF or Word format works best.
      </DialogDescription>
      <DialogBody>{pending ? <LoadingIcon /> : null}</DialogBody>
      <DialogActions>
        <Button disabled={pending} onClick={close} plain>
          Cancel
        </Button>
        <label className="flex items-center gap-2" htmlFor="file">
          <FileButton aria-disabled={pending} color="brand" disabled={pending}>
            Choose file
          </FileButton>
          <input
            accept="text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            id="file"
            name="file"
            onChange={upload}
            type="file"
          />
        </label>
      </DialogActions>
    </>
  );
}
