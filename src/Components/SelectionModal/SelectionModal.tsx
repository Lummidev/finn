import { FormModal } from "../FormModal/FormModal";
import "./SelectionModal.css";
interface SelectionModalProps<ValueType> {
  title?: string;
  options: { label: string; value: ValueType }[];
  visible: boolean;
  close: () => unknown;
}
export function SelectionModal<ValueType>(
  props: SelectionModalProps<ValueType>,
) {
  return (
    <FormModal
      title={props.title ?? "Selecione uma opção"}
      close={() => {
        props.close();
      }}
      visible={props.visible}
      onSubmit={() => {}}
      primaryButtonLabel="Selecionar"
    ></FormModal>
  );
}
