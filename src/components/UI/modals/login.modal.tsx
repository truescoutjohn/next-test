import LoginForm from "@/src/forms/login.form";
import CustomModal from "../../common/modal";

interface IProps {
  onClose: () => void;
  isOpen: boolean;
}

const LoginModal = ({ onClose, isOpen }: IProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Войти в аккаунт">
      <LoginForm onClose={onClose} />
    </CustomModal>
  );
};

export default LoginModal;
