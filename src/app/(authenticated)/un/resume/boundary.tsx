'use client';
import { useState } from 'react';
import type { ReactElement } from 'react';
import type { Session } from 'lucia';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { MainPanel } from '@/components/layout/main-panel';
import { Button } from '@/components/button';
import type { SessionUser } from '@/lib/auth';
import type { ResumeData } from '@/entities/resume-data';
import { VerticalNav } from '@/components/navigation/vertical-nav';
import { ObjectivePanel } from '@/entities/objective/components';
import { UploadResumeForm } from '@/entities/resume/forms';
import { ClientBoundary } from '@/components/client-boundary';

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
    <ClientBoundary session={{ session, user }}>
      <MainPanel>
        <MainPanel.Header title="Employment Profile">
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
        </MainPanel.Header>
        <MainPanel.Content>
          <div className="flex items-start gap-8 sm:gap-16">
            <div>
              <VerticalNav>
                {pageLinks.map((link) => (
                  <VerticalNav.Link key={link.name} link={link} />
                ))}
              </VerticalNav>
            </div>
            <div className="grow space-y-8">
              <ObjectivePanel objectives={resumeData.objectives} />
              {/*<EmploymentPanel employment={resumeData.employment} />*/}
            </div>
          </div>
        </MainPanel.Content>
      </MainPanel>
    </ClientBoundary>
  );
}
