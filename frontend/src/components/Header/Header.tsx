type TitlePropsType = {
  className?: string;
  children: JSX.Element | string | string[];
};

const Title = ({ className, children }: TitlePropsType) => (
  <h1 className={className}>{children}</h1>
);

Title.defaultProps = {
  className: null,
};

export default Title;
