import { Doughnut } from "react-chartjs-2";
import { SettingsContext } from "../../../Context/SettingsContext";
import { use, useEffect, useState } from "react";
import type { Plugin } from "chart.js";
import { getMoneyExpentByCategory } from "../../../Database/ReportRepository";
import "./CategoryChart.css";
import type { Category } from "../../../Entities/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faEllipsisH, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { categoryIcons } from "../../../categoryIcons";
const themeColors: Record<string, Record<string, string>> = {
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
  const { settings } = use(SettingsContext);
  const theme = settings.theme;
  const [topCategories, setTopCategories] = useState<
    [string, number, Category][]
  >([]);
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    getMoneyExpentByCategory()
      .then((data) => {
        const dataArray = Object.keys(data.moneyExpentByCategory).map(
          (key): [string, number, Category] => {
            const { category, money } = data.moneyExpentByCategory[key];
            return [key, money, category];
          },
        );
        if (dataArray.length === 0) {
          setEmpty(true);
          return;
        }
        const sorted = dataArray.sort(
          (a: [string, number, Category], b: [string, number, Category]) => {
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
          setTopCategories([
            ...top5,
            [
              "Outras",
              other,
              {
                id: "",
                name: "Outras",
                precedence: 0,
                words: [],
                iconName: "ellipsis",
              },
            ],
          ]);
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
          Registre um gasto em alguma categoria e ele aparecerá aqui!
        </span>
      ) : (
        <div className="category-chart__container">
          <div className="category-chart__chart">
            <Doughnut
              datasetIdKey="id"
              options={{
                /*@ts-expect-error "borderWidth" does work but apparently isn't registered in the type of this attribute*/
                borderWidth: 0,
                animation: false,
                maintainAspectRatio: false,
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
          <ul className="category-chart__legend">
            {topCategories.map((topCategory, i) => {
              const [name, money, category] = topCategory;
              const color = colors[i];
              return (
                <li className="category-chart__legend-item" key={name}>
                  <div
                    style={{ backgroundColor: color }}
                    className="category-chart__legend-color"
                  ></div>
                  <div className="category-chart__legend-details">
                    <span className="category-chart__legend-money">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(money)}
                    </span>
                    <span className="category-chart__legend-name">
                      {category.iconName && (
                        <FontAwesomeIcon
                          icon={(() => {
                            if (category.iconName === "ellipsis") {
                              return faEllipsisH;
                            } else {
                              return (
                                categoryIcons[category.iconName]?.icon ??
                                faQuestion
                              );
                            }
                          })()}
                        />
                      )}
                      {name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
