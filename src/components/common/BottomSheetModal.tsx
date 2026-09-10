import React, { useEffect, useRef, useState } from 'react';

interface BottomSheetModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

const EXIT_DURATION = 300;

export default function BottomSheetModal({ isOpen, title, onClose, children }: BottomSheetModalProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [active, setActive] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const openFrame = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      setMounted(true);
      openFrame.current = requestAnimationFrame(() => setActive(true));
    } else if (mounted) {
      setActive(false);
      closeTimer.current = window.setTimeout(() => setMounted(false), EXIT_DURATION);
    }
    return () => {
      if (openFrame.current) cancelAnimationFrame(openFrame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className={`modal-overlay ${active ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <div className="close-modal" onClick={onClose}>
            <i className="fas fa-times" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
