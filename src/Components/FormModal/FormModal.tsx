import type { PropsWithChildren } from "react";
import { Modal } from "../Modal/Modal";
import "./FormModal.css";
interface FormModalProps {
  title: string;
  visible: boolean;
  close: () => unknown;
  onSubmit: () => unknown;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
}
export const FormModal = (props: PropsWithChildren<FormModalProps>) => {
  return (
    <Modal title={props.title} visible={props.visible} onClose={props.close}>
      <form
        className="form-modal__form"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit();
        }}
      >
        {props.children}
        <button
          type="submit"
          className="form-modal__button form-modal__button--primary"
        >
          {props.primaryButtonLabel ?? "Salvar"}
        </button>
        <button
          type="button"
          className="form-modal__button form-modal__button--secondary"
          onClick={() => {
            props.close();
          }}
        >
          {props.secondaryButtonLabel ?? "Cancelar"}
        </button>
      </form>
    </Modal>
  );
};
