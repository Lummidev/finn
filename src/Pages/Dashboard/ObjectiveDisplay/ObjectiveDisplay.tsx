import { abbreviateNumber } from "../../../util";
import "./ObjectiveDisplay.css";
interface ObjectiveDisplayProps {
  expent: number;
  goal: number;
  title: string;
}
export const ObjectiveDisplay = (props: ObjectiveDisplayProps) => {
  const caution = props.goal - props.expent <= props.goal * 0.1;
  const warning = props.goal - props.expent < 0;
  return (
    <div className="objective-display">
      <h3 className="objective-display__title">{props.title}</h3>
      <div
        className={`objective-display__main ${caution ? (warning ? "objective-display__main--warning" : "objective-display__main--caution") : ""}`}
      >
        {"R$" + abbreviateNumber(props.expent)}
      </div>
      <div className="objective-display__goal-container">
        {"Meta: R$" + abbreviateNumber(props.goal)}
      </div>
    </div>
  );
};
