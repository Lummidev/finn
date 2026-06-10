import { useTranslation } from "react-i18next";
import { ProgressBar } from "../../../Components/ProgressBar/ProgressBar";
import "./ObjectiveDisplay.css";
interface ObjectiveDisplayProps {
  spent: number;
  goal: number;
  title: string;
}
export const ObjectiveDisplay = (props: ObjectiveDisplayProps) => {
  const caution = props.goal - props.spent <= props.goal * 0.1;
  const warning = props.goal - props.spent < 0;
  const formatParams = {
    value: {
      currency: "BRL",
    },
  };
  const { t } = useTranslation("objectiveDisplay");
  return (
    <div className="objective-display">
      <div className="objective-display__left">
        <h3 className="objective-display__title">{props.title}</h3>
        <div className="objective-display__counter">
          <div
            className={`objective-display__main ${caution ? (warning ? "objective-display__main--warning" : "objective-display__main--caution") : ""}`}
          >
            {t("compactCurrency", {
              value: props.spent,
              ns: "common",
              formatParams,
            })}
          </div>
          <div className="objective-display__goal-container">
            /
            {t("compactCurrency", {
              value: props.goal,
              ns: "common",
              formatParams,
            })}
          </div>
        </div>
      </div>

      <div className="objective-display__right">
        <ProgressBar
          caution={caution}
          warn={warning}
          current={props.spent}
          max={props.goal}
        />
      </div>
    </div>
  );
};
