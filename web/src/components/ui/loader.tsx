import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

const Loader = ({
  size = 40,
  color = "#e94560",
}: {
  size?: number | string;
  color?: string;
}) => {
  return <DotSpinner size={size} speed="1.0" color={color} />;
};

export default Loader;
