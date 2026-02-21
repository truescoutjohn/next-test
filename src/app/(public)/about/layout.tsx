interface IProps {
  children: React.ReactNode;
}

const AboutLayout = ({ children }: IProps) => {
  return <section>{children}</section>;
};

export default AboutLayout;
