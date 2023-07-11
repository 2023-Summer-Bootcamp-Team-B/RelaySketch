type TitlePropsType = {
  className?: string;
  title: string;
};

const Title = ({ className, title }: TitlePropsType) => (
  <h1 className={className}>{title}</h1>
);

Title.defaultProps = {
  className: null,
};

export default Title;
