import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  id: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  isOpen,
  onClose,
  id,
  ...dialogProps
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }
  }, [isOpen, id]);

  return (
    <>
      {isOpen && (
        <dialog
          ref={dialogRef}
          {...dialogProps}
          id={id}
          className="modal"
          onClose={onClose}
        >
          <div className="modal-box">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            <div className="py-4">{children}</div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop w-full h-full"
            onClick={onClose}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default Modal;
