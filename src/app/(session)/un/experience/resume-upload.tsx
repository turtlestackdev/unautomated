import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/ui/dialog';
import { Button, FileButton } from '@/ui/button';
import { LoadingIcon } from '@/ui/icons/loading-icon';
import { uploadResume } from '@/app/(session)/un/experience/actions';

export function ResumeUpload({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}): ReactElement {
  const [state, formAction] = useFormState(uploadResume, { status: 'new' });
  console.log(state);
  return (
    <Dialog onClose={setIsOpen} open={open}>
      <form action={formAction}>
        <ResumeUploadChild
          close={() => {
            setIsOpen(false);
          }}
        />
      </form>
    </Dialog>
  );
}

function ResumeUploadChild({ close }: { close: () => void }): ReactElement {
  const { pending } = useFormStatus();
  console.log('pending', pending);
  const upload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('upload called', event);
    if (event.target.files) {
      const [file] = event.target.files;
      if (file !== undefined) {
        //url = URL.createObjectURL(file);
        event.target.form?.requestSubmit();
        console.log('submit called', pending);
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
        <label className="flex items-center gap-2" htmlFor="resume_file">
          <FileButton aria-disabled={pending} color="brand" disabled={pending}>
            Choose file
          </FileButton>
          <input
            accept="text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            id="resume_file"
            name="resume_file"
            onChange={upload}
            type="file"
          />
        </label>
      </DialogActions>
    </>
  );
}
