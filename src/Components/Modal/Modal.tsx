import {
  useEffect,
  useRef,
  type MouseEvent,
  type PropsWithChildren,
} from "react";

import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => unknown;
}
export const Modal = (props: PropsWithChildren<ModalProps>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!dialogRef.current) return;
    if (props.visible) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [props.visible]);
  const closeIfClickedOutside = (e: MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const dialogDimensions = dialogRef.current.getBoundingClientRect();

    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      props.onClose();
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClick={(e) => {
        closeIfClickedOutside(e);
      }}
    >
      <div className="modal__header">
        <h2>{props.title}</h2>
        <button
          type="button"
          className="modal__close-button"
          onClick={props.onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {props.children}
    </dialog>
  );
};
