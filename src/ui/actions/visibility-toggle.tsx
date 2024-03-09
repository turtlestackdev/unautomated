import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Button } from '@/ui/button';

export function VisibilityToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: (show: boolean) => void;
}): React.JSX.Element {
  const icon = show ? <EyeSlashIcon /> : <EyeIcon />;
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
