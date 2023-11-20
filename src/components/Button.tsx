import { FC, MouseEventHandler, ReactNode } from 'react';


interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: 'button' | 'submit' | 'reset';
  icon?: ReactNode; // Icon as a ReactNode
  iconStyle?: string; // Additional class name for styling

}

const Button: FC<ButtonProps> = ({ onClick, type, icon, iconStyle }) => {
  return (
    <button type={type} onClick={onClick}>
      {icon && <span className={`btn-icon secondary.main ${iconStyle}`}>{icon}</span>}
    </button>
  );
};

export default Button;