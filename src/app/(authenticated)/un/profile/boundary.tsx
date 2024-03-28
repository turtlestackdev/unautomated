'use client';
import React, { useState } from 'react';
import type { ReactElement } from 'react';
import type { Session } from 'lucia';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/button';
import type { SessionUser } from '@/lib/auth';
import type { ResumeData } from '@/entities/resume-data';
import { VerticalNav } from '@/components/navigation/vertical-nav';
import { ObjectivePanel } from '@/entities/objective/components';
import { UploadResumeForm } from '@/entities/resume/forms';
import { AppShell } from '@/components/layout/app-shell';
import { EmploymentPanel } from '@/entities/employment/components/panel';
import { deleteEmployment, saveEmployment } from '@/entities/employment/actions';

export function Boundary({
  user,
  session,
  resumeData,
}: {
  user: SessionUser;
  session: Session;
  resumeData: ResumeData;
}): ReactElement {
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const pageLinks = [
    {
      name: 'Employment Profile',

      onClick: () => {
        console.log('clicked');
      },
      current: true,
    },
    {
      name: 'Resumes',

      onClick: () => {
        console.log('clicked');
      },
      current: false,
    },
    {
      name: 'Education',
      onClick: () => {
        console.log('clicked');
      },
      current: false,
    },
    {
      name: 'Skills',
      onClick: () => {
        console.log('clicked');
      },
      current: false,
    },
  ];

  return (
    <AppShell session={{ session, user }}>
      <AppShell.Header title="Employment Profile">
        <Button
          title="Uplaod resume"
          color="brand"
          onClick={() => {
            setFileDialogOpen(true);
          }}
        >
          <DocumentArrowUpIcon />
          <span className="hidden sm:inline">Upload resume</span>
        </Button>
        <UploadResumeForm open={fileDialogOpen} setIsOpen={setFileDialogOpen} />
      </AppShell.Header>
      <AppShell.Content>
        <AppShell.SideBar>
          <VerticalNav>
            {pageLinks.map((link) => (
              <VerticalNav.Link key={link.name} link={link} />
            ))}
          </VerticalNav>
        </AppShell.SideBar>
        <AppShell.Main>
          <ObjectivePanel objectives={resumeData.objectives} />
          <EmploymentPanel
            employment={resumeData.employment}
            saveAction={saveEmployment.bind(null, user.id)}
            deleteAction={deleteEmployment.bind(null, user.id)}
          />
        </AppShell.Main>
      </AppShell.Content>
    </AppShell>
  );
}
