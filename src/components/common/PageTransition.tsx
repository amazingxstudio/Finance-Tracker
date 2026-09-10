import React, { useEffect, useRef, useState } from 'react';

interface PageTransitionProps {
  /** Changing this key re-triggers the enter animation (e.g. the route name). */
  transitionKey: string;
  children: React.ReactNode;
}

export default function PageTransition({ transitionKey, children }: PageTransitionProps) {
  const [entered, setEntered] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    setEntered(false);
    // Wait a frame so the browser paints the "enter" state before we
    // transition to the resting state — required for the transition to
    // actually animate instead of jumping straight to its end value.
    frame.current = requestAnimationFrame(() => setEntered(true));
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionKey]);

  return (
    <div className={entered ? 'page-enter page-enter-active' : 'page-enter'}>
      {children}
    </div>
  );
}
