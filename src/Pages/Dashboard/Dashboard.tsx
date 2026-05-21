import { Fragment, useEffect, useState } from "react";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { CategoryChart } from "./CategoryChart/CategoryChart";
import "./Dashboard.css";
import { MonthChart } from "./MonthChart/MonthChart";
import { ObjectiveDisplay } from "./ObjectiveDisplay/ObjectiveDisplay";
import { Settings } from "../../settings";
import { getMoneyExpentByPeriod } from "../../Database/ReportRepository";
import { useTranslation } from "react-i18next";

export const Dashboard = () => {
  const [goals, setGoals] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [spent, setSpent] = useState({
    day: 0,
    week: 0,
    month: 0,
  });
  const { t } = useTranslation("dashboard");
  useEffect(() => {
    const { objectives } = Settings.load();
    setGoals(objectives);
    getMoneyExpentByPeriod()
      .then((result) => {
        const { day, week, month } = result;
        setSpent({ day, week, month });
      })
      .catch((e) => {
        throw e;
      });
  }, []);

  const objectives = [
    { title: t("today"), expent: spent.day, goal: goals.daily },
    { title: t("week"), expent: spent.week, goal: goals.weekly },
    { title: t("month"), expent: spent.month, goal: goals.monthly },
  ].filter((objective) => objective.goal > 0);
  return (
    <div className="dashboard">
      <PageHeader title={t("pageNames.dashboard", { ns: "common" })} />
      <div className="dashboard__content">
        <div className="dashboard__objectives">
          <h2 className="dashboard__section-title">{t("expenseGoals")}</h2>
          <div className="dashboard__display-row">
            {objectives.length > 0 ? (
              objectives.map((objective, i) => (
                <Fragment key={objective.title}>
                  <ObjectiveDisplay
                    spent={objective.expent}
                    goal={objective.goal}
                    title={objective.title}
                  />
                  {i != objectives.length - 1 && (
                    <span className="dashboard__horizontal-separator" />
                  )}
                </Fragment>
              ))
            ) : (
              <span className="dashboard__notice">{t("noGoalsNotice")}</span>
            )}
          </div>
        </div>

        <div className="dashboard__chart">
          <h2 className="dashboard__chart-title">{t("todaysExpenses")}</h2>

          <div className="dashboard__chart-content">
            <CategoryChart />
          </div>
        </div>
        <div className="dashboard__chart">
          <h2 className="dashboard__chart-title">{t("monthlyExpenses")}</h2>

          <div className="dashboard__chart-content">
            <MonthChart />
          </div>
        </div>
      </div>
    </div>
  );
};
