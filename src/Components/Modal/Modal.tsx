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

  // https://blog.webdevsimplified.com/2023-04/html-dialog/#close-on-outside-click
  const closeIfClickedOutside = (e: MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const dialogDimensions = dialogRef.current.getBoundingClientRect();
    //https://stackoverflow.com/a/35034284
    if (e.screenX === 0 && e.screenY === 0) return;
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
      role="dialog"
      aria-labelledby="modal-title"
      ref={dialogRef}
      className="modal"
      onClick={(e) => {
        closeIfClickedOutside(e);
      }}
      onCancel={(e) => {
        e.preventDefault();
        props.onClose();
      }}
    >
      <div className="modal__header">
        <h2 id="modal-title">{props.title}</h2>
        <button
          type="button"
          className="modal__close-button"
          onClick={props.onClose}
          aria-label="Fechar"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {props.children}
    </dialog>
  );
};
