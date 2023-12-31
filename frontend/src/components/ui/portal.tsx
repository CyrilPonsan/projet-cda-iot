import { ReactNode, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

const Portal = (props: PortalProps) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#root");
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? createPortal(<div>{props.children}</div>, ref.current)
    : null;
};

export default Portal;
