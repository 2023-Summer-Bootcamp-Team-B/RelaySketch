type ButtonPropsType = {
  type: "button" | "submit" | "reset";
  className?: string;
  children: JSX.Element | string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({ type, className, children, onClick }: ButtonPropsType) => (
  // eslint-disable-next-line react/button-has-type
  <button type={type} className={className} onClick={onClick}>
    {children}
  </button>
);

Button.defaultProps = {
  className: null,
};

export default Button;
