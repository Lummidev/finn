import "./ProgressBar.css";
interface ProgressBarProps {
  min?: number;
  max: number;
  current: number;
  caution?: boolean;
  warn?: boolean;
}
export const ProgressBar = ({
  current,
  max,
  min = 0,
  caution,
  warn,
}: ProgressBarProps) => {
  const percentage = (current >= min ? current : min) / max;
  const fillPercentage = Math.floor((percentage >= 1 ? 1 : percentage) * 100);
  const modifierClasses: { container: string; bar: string } = warn
    ? {
        bar: "progress-bar__bar--warn",
        container: "progress-bar--warn",
      }
    : caution
      ? {
          bar: "progress-bar__bar--caution",
          container: "progress-bar--caution",
        }
      : {
          bar: "",
          container: "",
        };
  return (
    <div className={`progress-bar ${modifierClasses.container}`}>
      <span
        className={`progress-bar__bar ${modifierClasses.bar}`}
        style={{ width: `${fillPercentage}%` }}
      ></span>
    </div>
  );
};
