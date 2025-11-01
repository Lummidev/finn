import { useEffect, useState } from "react";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { CategoryChart } from "./CategoryChart/CategoryChart";
import "./Dashboard.css";
import { MonthChart } from "./MonthChart/MonthChart";
import { ObjectiveDisplay } from "./ObjectiveDisplay/ObjectiveDisplay";
import { Settings } from "../../settings";
import { getMoneyExpentByPeriod } from "../../Database/ReportRepository";

export const Dashboard = () => {
  const [goals, setGoals] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [expent, setExpent] = useState({
    day: 0,
    week: 0,
    month: 0,
  });
  useEffect(() => {
    const { objectives } = Settings.load();
    setGoals(objectives);
    getMoneyExpentByPeriod()
      .then((result) => {
        const { day, week, month } = result;
        setExpent({ day, week, month });
      })
      .catch((e) => {
        throw e;
      });
  }, []);

  const objectives = [
    { title: "Hoje", expent: expent.day, goal: goals.daily },
    { title: "Semana", expent: expent.week, goal: goals.weekly },
    { title: "Mês", expent: expent.month, goal: goals.monthly },
  ].filter((objective) => objective.goal > 0);
  return (
    <div className="dashboard">
      <PageHeader title="Resumo" />
      <div className="dashboard__content">
        <div className="dashboard__objectives">
          <h2 className="dashboard__section-title">Gastos</h2>
          <div className="dashboard__display-row">
            {objectives.length > 0 ? (
              <div className="dashboard__display-grid">
                {objectives.map((objective) => (
                  <ObjectiveDisplay
                    expent={objective.expent}
                    goal={objective.goal}
                    title={objective.title}
                    key={objective.title}
                  />
                ))}
              </div>
            ) : (
              <span className="dashboard__notice">
                Configure uma meta de gastos na página de ajustes e ela
                aparecerá aqui!
              </span>
            )}
          </div>
        </div>

        <div className="dashboard__chart">
          <h2 className="dashboard__chart-title">
            Dinheiro gasto por categoria
          </h2>

          <div className="dashboard__chart-content">
            <CategoryChart />
          </div>
        </div>
        <div className="dashboard__chart">
          <h2 className="dashboard__chart-title">Gastos do mês</h2>

          <div className="dashboard__chart-content">
            <MonthChart />
          </div>
        </div>
      </div>
    </div>
  );
};
