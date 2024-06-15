import { cn } from "../../../../../utils/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Container: React.FunctionComponent<ContainerProps> = ({
  className,
  ...attr
}) => {
  return (
    <div className={className} {...attr}>
      {attr?.children}
    </div>
  );
};

export default Container;
