'use client';

import Badge from 'app/common/Badge';

interface StatusBadgeProps {
  emailConfirmed: boolean;
  userConfirmed: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ emailConfirmed, userConfirmed }) => {
  if (!emailConfirmed) {
    return <Badge variant="red" text="Niepotwierdzony email" />;
  } else if (!userConfirmed) {
    return <Badge variant="red" text="Niepotwierdzony użytkownik" />;
  } else {
    return <Badge variant="green" text="Aktywny" />;
  }
};

export default StatusBadge;
