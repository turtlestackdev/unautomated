import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/button';

export function VisibilityToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: (show: boolean) => void;
}): React.JSX.Element {
  const icon = show ? <ChevronDownIcon /> : <ChevronUpIcon />;
  return (
    <Button
      title={show ? 'hide' : 'show'}
      plain
      onClick={() => {
        onToggle(!show);
      }}
    >
      {icon}
    </Button>
  );
}
