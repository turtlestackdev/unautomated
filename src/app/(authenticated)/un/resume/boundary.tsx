'use client';
import { Fragment, useState } from 'react';
import type { ReactElement } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import type { Selectable } from 'kysely';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import type { Session } from 'lucia';
import { MainPanel } from '@/ui/layout/main-panel';
import { Button } from '@/ui/button';
import { Text } from '@/ui/text';
import type { SessionUser } from '@/lib/auth';
import type { ResumeData } from '@/entities/resume-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { EnabledIcon } from '@/ui/icons/action-icons';
import { VerticalNav } from '@/ui/navigation/vertical-nav';
import { CreateResumeForm } from '@/app/(authenticated)/un/resume/forms';
import type { ResumeObjective } from '@/database/schema';
import { ObjectiveForm } from '@/entities/objective/forms';
import { UploadResumeForm } from '@/entities/resume/forms';
import { ClientBoundary } from '@/ui/client-boundary';

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
      name: 'Profile Data ',

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
        <MainPanel.Header title="Profile Data">
          <Button
            color="brand"
            onClick={() => {
              setFileDialogOpen(true);
            }}
          >
            <PlusIcon /> Add resume
          </Button>
          <UploadResumeForm open={fileDialogOpen} setIsOpen={setFileDialogOpen} />
        </MainPanel.Header>
        <MainPanel.Content>
          <div className="flex items-start gap-8 sm:gap-16">
            <div className="grow space-y-8">
              <div className="max-w-2xl">
                <CreateResumeForm resumeData={resumeData} user={user} />
              </div>
            </div>
            <div>
              <VerticalNav>
                {pageLinks.map((link) => (
                  <VerticalNav.Link key={link.name} link={link} />
                ))}
              </VerticalNav>
            </div>
          </div>
        </MainPanel.Content>
      </MainPanel>
    </ClientBoundary>
  );
}

export function ObjectivePanel({
  objectives,
}: {
  user: SessionUser;
  objectives: Selectable<ResumeObjective>[];
}): ReactElement {
  return (
    <>
      <div className="max-w-2xl">
        <ObjectiveForm />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Objective</TableHeader>
            <TableHeader>Default</TableHeader>
            <TableHeader>
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {objectives.map((objective) => (
            <TableRow key={objective.id}>
              <TableCell>
                <Text className="max-w-prose truncate">{objective.objective}</Text>
              </TableCell>
              <TableCell>
                <EnabledIcon enabled={objective.is_default} />
              </TableCell>
              <TableCell>
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ focus }) => (
                          <button
                            className={clsx(
                              focus ? 'bg-gray-50' : '',
                              'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                            )}
                            type="button"
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ focus }) => (
                          <button
                            className={clsx(
                              focus ? 'bg-gray-50' : '',
                              'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                            )}
                            type="button"
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
