import { useState } from "react";
import { FormModal } from "../FormModal/FormModal";
import "./DateModal.css";
import dayjs, { type ManipulateType } from "dayjs";
import { LabeledInput } from "../LabeledInput/LabeledInput";
interface DateModalProps {
  visible: boolean;
  close: () => unknown;
  oldestPossibleTimestampMiliseconds: number;
  onSubmit: (fromDate: string, toDate: string) => unknown;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  secondaryButtonAction?: () => unknown;
}
const inputFormat = "YYYY-MM-DD";

export const DateModal = (props: DateModalProps) => {
  const [fromDate, setFromDate] = useState(dayjs().format(inputFormat));
  const [toDate, setToDate] = useState(dayjs().format(inputFormat));
  const activeSuggestion = (countFromNow: number, unit: ManipulateType) => {
    return (
      dayjs(toDate).isSame(dayjs(), "day") &&
      dayjs().diff(dayjs(fromDate), unit) === countFromNow
    );
  };
  const suggestionButtons: {
    label: string;
    count: number;
    unit: ManipulateType;
  }[] = [
    {
      label: "Ontem",
      count: 1,
      unit: "days",
    },
    {
      label: "7 dias",
      count: 7,
      unit: "days",
    },
    {
      label: "1 mês",
      count: 1,
      unit: "month",
    },
    {
      label: "3 meses",
      count: 3,
      unit: "months",
    },
  ];
  const viableDateSuggestions = suggestionButtons.filter((suggestion) => {
    const oldest = dayjs(props.oldestPossibleTimestampMiliseconds);

    return dayjs()
      .subtract(suggestion.count, suggestion.unit)
      .isSameOrAfter(oldest, "day");
  });
  return (
    <FormModal
      title="Selecione um Período"
      visible={props.visible}
      close={() => {
        props.close();
      }}
      onSubmit={() => {
        props.onSubmit(fromDate, toDate);
        props.close();
      }}
      primaryButtonLabel={props.primaryButtonLabel}
      secondaryButtonLabel={props.secondaryButtonLabel}
      secondaryButtonAction={props.secondaryButtonAction}
    >
      <div className="date-modal">
        {viableDateSuggestions.length > 0 && (
          <div className="date-modal__suggestions">
            {viableDateSuggestions.map((suggestion) => {
              return (
                <button
                  key={suggestion.label}
                  className={`date-modal__suggestion-button ${activeSuggestion(suggestion.count, suggestion.unit) ? "date-modal__suggestion-button--active" : ""}`}
                  type="button"
                  onClick={() => {
                    const today = dayjs();
                    setFromDate(
                      today
                        .subtract(suggestion.count, suggestion.unit)
                        .format(inputFormat),
                    );
                    setToDate(today.format(inputFormat));
                  }}
                >
                  {suggestion.label}
                </button>
              );
            })}
          </div>
        )}

        <LabeledInput
          type="date"
          className="date-modal__input"
          name="Data de Início"
          min={dayjs(props.oldestPossibleTimestampMiliseconds).format(
            inputFormat,
          )}
          max={dayjs.min(dayjs(), dayjs(toDate)).format(inputFormat)}
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
          }}
        />

        <LabeledInput
          type="date"
          className="date-modal__input"
          name="Data Final"
          value={toDate}
          min={fromDate}
          max={dayjs().format(inputFormat)}
          onChange={(e) => {
            setToDate(e.target.value);
          }}
        />
      </div>
    </FormModal>
  );
};
