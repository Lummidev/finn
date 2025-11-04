import type { ChangeEventHandler, KeyboardEventHandler } from "react";
import "./LabeledInput.css";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NumericFormat } from "react-number-format";

type LabeledInputProps = {
  name: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  step?: number;
  className?: string;
  min?: string;
  max?: string;
  button?: {
    icon: IconDefinition;
    label: string;
    disabled?: boolean;
  } & ({ type: "button"; onClick: () => unknown } | { type: "submit" });
} & (
  | {
      type: "number";
      value?: number;
      prefix?: string;
      onValueChange: (value: number | undefined) => unknown;
    }
  | {
      type?: "text" | "date";
      value: string;
      onChange: ChangeEventHandler<HTMLInputElement>;
    }
);
export const LabeledInput = (props: LabeledInputProps) => {
  return (
    <div className={`labeled-input ${props.className ?? ""}`}>
      <label className="labeled-input__label" htmlFor={`id-${props.name}`}>
        {props.name}
      </label>
      <div className="labeled-input__input-row">
        {props.type === "number" ? (
          <NumericFormat
            id={`id-${props.name}`}
            placeholder={props.placeholder}
            onKeyDown={props.onKeyDown}
            onValueChange={(values) => {
              props.onValueChange(values.floatValue);
            }}
            value={props.value}
            allowNegative={false}
            allowedDecimalSeparators={[",", "."]}
            decimalScale={2}
            fixedDecimalScale={true}
            className="labeled-input__input"
            prefix={props.prefix}
          />
        ) : (
          <input
            className="labeled-input__input"
            type={props.type ?? "text"}
            id={`id-${props.name}`}
            onChange={props.onChange}
            value={props.value}
            placeholder={props.placeholder}
            onKeyDown={props.onKeyDown}
            min={props.min}
            max={props.max}
          />
        )}

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
