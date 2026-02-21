import RegistrationForm from "@/src/forms/registration.form";
import CustomModal from "../../common/modal";

interface IProps {
  onClose: () => void;
  isOpen: boolean;
}

const RegistrationModal = ({ onClose, isOpen }: IProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Создать аккаунт">
      <RegistrationForm onClose={onClose} />
    </CustomModal>
  );
};

export default RegistrationModal;
