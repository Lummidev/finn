import type { PropsWithChildren } from "react";
import { Modal } from "../Modal/Modal";
import "./FormModal.css";
import { useTranslation } from "react-i18next";
interface FormModalProps {
  title: string;
  visible: boolean;
  close: () => unknown;
  onSubmit: () => unknown;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  secondaryButtonAction?: () => unknown;
}
export const FormModal = (props: PropsWithChildren<FormModalProps>) => {
  const { t } = useTranslation("formModal");
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
          {props.primaryButtonLabel ?? t("defaultPrimaryButtonLabel")}
        </button>
        <button
          type="button"
          className="form-modal__button form-modal__button--secondary"
          onClick={() => {
            if (props.secondaryButtonAction) {
              props.secondaryButtonAction();
            }
            props.close();
          }}
        >
          {props.secondaryButtonLabel ?? t("defaultSecondaryButtonLabel")}
        </button>
      </form>
    </Modal>
  );
};
