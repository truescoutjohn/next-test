interface IProps {
  children: React.ReactNode;
}

const IngredientsLayout = ({ children }: IProps) => {
  return <section>{children}</section>;
};

export default IngredientsLayout;
