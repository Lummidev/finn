import { Doughnut } from "react-chartjs-2";
import { ThemeContext } from "../../../Context/ThemeContext";
import { use, useEffect, useState } from "react";
import type { Plugin } from "chart.js";
import { getMoneyExpentByCategory } from "../../../Database/ReportRepository";
import "./CategoryChart.css";
const themeColors = {
  dark: {
    blue: "#8aadf4",
    green: "#a6da95",
    mauve: "#c6a0f6",
    peach: "#f5a97f",
    pink: "#f5bde6",
    overlay: "#5b6078",
    text: "#cad3f5",
  },
  light: {
    blue: "#1e66f5",
    green: "#40a02b",
    mauve: "#8839ef",
    peach: "#fe640b",
    pink: "#ea76cb",
    overlay: "#acb0be",
    text: "#4c4f69",
  },
};
const ShadowPlugin: Plugin = {
  id: "p1",
  beforeDraw: (chart) => {
    const { ctx } = chart;
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 2;

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
  },
};
export const CategoryChart = () => {
  const { theme } = use(ThemeContext);
  const [topCategories, setTopCategories] = useState<[string, number][]>();
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    getMoneyExpentByCategory()
      .then((data) => {
        const dataArray = Object.keys(data.moneyExpentByCategory).map(
          (key): [string, number] => {
            const { id, money } = data.moneyExpentByCategory[key];
            return [key, money];
          },
        );
        if (dataArray.length === 0) {
          setEmpty(true);
          return;
        }
        const sorted = dataArray.sort(
          (a: [string, number], b: [string, number]) => {
            const [, moneyA] = a;
            const [, moneyB] = b;
            return moneyB - moneyA;
          },
        );
        const top5 = sorted.slice(0, 5);
        const rest = sorted.slice(5);
        console.log(top5, rest);
        const other = rest
          .map((category) => category[1])
          .reduce(
            (accumulator, current) => accumulator + current,

            0,
          );
        if (other > 0) {
          setTopCategories([...top5, ["Outras", other]]);
        } else {
          setTopCategories(top5);
        }
      })
      .catch((e) => {
        throw e;
      });
  }, []);
  const colors = [
    themeColors[theme].blue,
    themeColors[theme].mauve,
    themeColors[theme].peach,
    themeColors[theme].green,
    themeColors[theme].pink,
    themeColors[theme].overlay,
  ];
  return (
    <div className="category-chart">
      {empty ? (
        <span className="category-chart__empty-info">
          Não foi encontrado nenhum gasto agrupado por categoria
        </span>
      ) : !topCategories ? (
        <></>
      ) : (
        <div className="category-chart__container">
          <ul className="category-chart__legend">
            {topCategories.map((category, i) => {
              const [name, moneyExpent] = category;
              const color = colors[i];
              return (
                <li className="category-chart__legend-item" key={name}>
                  <div
                    style={{ backgroundColor: color }}
                    className="category-chart__legend-color"
                  ></div>
                  {name}
                </li>
              );
            })}
          </ul>
          <Doughnut
            className="category-chart__chart"
            datasetIdKey="id"
            options={{
              borderWidth: 0,
              animation: true,
              color: themeColors[theme].text,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      let label = context.dataset.label ?? "";

                      if (label) {
                        label += ": ";
                      }
                      label += new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(context.parsed);
                      return label;
                    },
                  },
                },
              },
            }}
            plugins={[ShadowPlugin]}
            data={{
              labels: topCategories.map((category) => category[0]),
              datasets: [
                {
                  id: 1,
                  label: "Dinheiro gasto",
                  data: topCategories.map((category) => category[1]),
                  offset: topCategories.length > 0 ? 16 : 0,
                  backgroundColor: colors,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};
