'use client';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { MainPanel } from '@/ui/layout/main-panel';
import { Button } from '@/ui/button';
import { Text } from '@/ui/text';
import type { SessionUser } from '@/auth';
import { ResumeUpload } from '@/app/(session)/un/experience/resume-upload';

export function Boundary({ user }: { user: SessionUser }): ReactElement {
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  return (
    <MainPanel user={user}>
      <MainPanel.Header title="Experience">
        <Button
          color="brand"
          onClick={() => {
            setFileDialogOpen(true);
          }}
        >
          <PlusIcon /> Add resume
        </Button>
        <ResumeUpload open={fileDialogOpen} setIsOpen={setFileDialogOpen} />
      </MainPanel.Header>
      <MainPanel.Content>
        <Text>
          This page is a compilation of all your experience and skills. Use it to generate resumes
          tailored to individual job postings.
        </Text>
      </MainPanel.Content>
    </MainPanel>
  );
}
