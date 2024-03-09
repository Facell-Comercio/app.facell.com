import { useState, useRef, useEffect } from 'react';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const modalRef = useRef(null);

  // Focus management for accessibility
  const handleFocusTrap = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      event.stopPropagation();
      modalRef.current.focus();
    }
  };

  // Handle ESC key press to close modal
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleFocusTrap);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleFocusTrap);
    };
  }, [isOpen]); // Only add/remove event listeners when isOpen changes

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return { isOpen, modalRef, handleOpen, handleClose };
};

export default useModal;
