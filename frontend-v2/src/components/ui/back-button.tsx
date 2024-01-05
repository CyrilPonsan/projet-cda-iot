import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type Props = {
  url?: string;
};

const BackButton: FC<Props> = ({ url = ".." }) => {
  const nav = useNavigate();

  const handleNavBack = () => {
    nav(url);
  };

  return (
    <button
      className="btn btn-sm btn-primary btn-circle"
      onClick={handleNavBack}
    >
      <ChevronLeft />
    </button>
  );
};

export default BackButton;
