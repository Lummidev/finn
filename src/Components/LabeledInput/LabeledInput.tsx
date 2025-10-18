import type {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
} from "react";
import "./LabeledInput.css";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LabeledInputProps {
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  value: string | number;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  step?: number;
  className?: string;
  min?: string;
  max?: string;
  button?: {
    icon: IconDefinition;
    label: string;
    disabled?: boolean;
  } & ({ type: "button"; onClick: () => unknown } | { type: "submit" });
}
export const LabeledInput = (props: LabeledInputProps) => {
  return (
    <div className={`labeled-input ${props.className ?? ""}`}>
      <label className="labeled-input__label" htmlFor={`id-${props.name}`}>
        {props.name}
      </label>
      <div className="labeled-input__input-row">
        <input
          className="labeled-input__input"
          type={props.type ?? "text"}
          step={props.step}
          id={`id-${props.name}`}
          onChange={props.onChange}
          value={props.value}
          placeholder={props.placeholder}
          onKeyDown={props.onKeyDown}
          min={props.min}
          max={props.max}
        />
        {!!props.button && (
          <button
            className="labeled-input__button"
            type={props.button.type}
            disabled={props.button.disabled}
            onClick={
              props.button.type === "button" ? props.button.onClick : undefined
            }
            aria-label={props.button.label}
          >
            <FontAwesomeIcon icon={props.button.icon} />
          </button>
        )}
      </div>
    </div>
  );
};
