import { useEffect, useState } from "react";
import { categoryIcons } from "../../categoryIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ChooseIconModal.css";
import { FormModal } from "../FormModal/FormModal";
import { useTranslation } from "react-i18next";
interface ChooseIconModalProps {
  visible: boolean;
  close: () => unknown;
  onChoice: (iconName: string) => unknown;
  initialIconName?: string;
}
export const ChooseIconModal = (props: ChooseIconModalProps) => {
  const [selectedIconName, setSelectedIconName] = useState<
    string | undefined
  >();
  const { t } = useTranslation("chooseIconModal");
  useEffect(() => {
    if (props.visible) {
      setSelectedIconName(props.initialIconName);
    } else {
      setSelectedIconName(undefined);
    }
  }, [props.visible, props.initialIconName]);
  return (
    <FormModal
      title={t("title")}
      visible={props.visible}
      close={props.close}
      onSubmit={() => {
        if (selectedIconName) {
          props.onChoice(selectedIconName);
          props.close();
        }
      }}
    >
      <div className="choose-icon__icon-list">
        {Object.values(categoryIcons).map((categoryIcon) => {
          return (
            <label
              key={categoryIcon.icon.iconName}
              aria-label={categoryIcon.displayName}
              className="choose-icon__label"
            >
              <input
                className="choose-icon__radio"
                type="radio"
                name="category-icon-option"
                value={categoryIcon.icon.iconName}
                checked={selectedIconName === categoryIcon.icon.iconName}
                onChange={(e) => {
                  setSelectedIconName(e.target.value);
                }}
              />
              <FontAwesomeIcon icon={categoryIcon.icon} />
            </label>
          );
        })}
      </div>
    </FormModal>
  );
};
