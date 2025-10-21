import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { CategoryChart } from "./CategoryChart/CategoryChart";
import "./Dashboard.css";
import { MonthChart } from "./MonthChart/MonthChart";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <PageHeader title="Resumo" />
      <div className="dashboard__content">
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
