'use client';

import { Toaster, toast } from 'sonner';

import CustomButton from 'app/common/CustomButton';
import { api } from 'utils/api';

interface Props {
  canBeConfirmed: boolean;
  userId: string;
}

const ActionButtons: React.FC<Props> = ({ canBeConfirmed, userId }) => {
  const apiContext = api.useContext();
  const { mutate: confirmUser, isLoading: isConfirming } = api.admin.confirmUser.useMutation();
  const { mutate: deleteUser, isLoading: isDeleting } = api.admin.deleteUser.useMutation();

  const handleConfirm = () => {
    confirmUser(
      { userId },
      {
        onSuccess: async () => {
          toast.success('Użytkownik został potwierdzony');
          await apiContext.admin.getUsers.invalidate();
        },
        onError: () => toast.error('Wystąpił błąd podczas potwierdzania użytkownika')
      }
    );
  };

  const handleDelete = () => {
    deleteUser(
      { userId },
      {
        onSuccess: async () => {
          toast.success('Użytkownik został usunięty');
          await apiContext.admin.getUsers.invalidate();
        },
        onError: () => toast.error('Wystąpił błąd podczas usuwania użytkownika')
      }
    );
  };

  return (
    <>
      {canBeConfirmed && <CustomButton loading={isConfirming} onClick={handleConfirm} text="Potwierdź" size="sm" />}
      <CustomButton text="Usuń" loading={isDeleting} size="sm" variant="red" onClick={handleDelete} />
      <Toaster richColors />
    </>
  );
};

export default ActionButtons;
