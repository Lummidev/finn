import { Doughnut } from "react-chartjs-2";
import { SettingsContext } from "../../../Context/SettingsContext";
import { use, useEffect, useState } from "react";
import type { ChartDataset, Plugin } from "chart.js";
import { getMoneyExpentByCategoryToday } from "../../../Database/ReportRepository";
import "./CategoryChart.css";
import type { Category } from "../../../Entities/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { categoryIcons } from "../../../categoryIcons";
const themeColors: Record<string, Record<string, string>> = {
  dark: {
    blue: "#8aadf4",
    red: "#ed8796",
    maroon: "#ee99a0",
    teal: "#8bd5ca",
    peach: "#f5a97f",
    mauve: "#c6a0f6",
    yellow: "#eed49f",
    pink: "#f5bde6",
    green: "#a6da95",
    flamingo: "#f0c6c6",
    overlay: "#5b6078",
    surface0: "#363a4f",
    surface2: "#585b70",
    text: "#cad3f5",
  },
  light: {
    blue: "#1e66f5",
    red: "#d20f39",
    maroon: "#e64553",
    teal: "#179299",
    peach: "#fe640b",
    mauve: "#8839ef",
    yellow: "#df8e1d",
    pink: "#ea76cb",
    green: "#40a02b",
    flamingo: "#dd7878",
    overlay: "#acb0be",
    surface0: "#ccd0da",
    surface2: "#acb0be",
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
  const [data, setData] = useState<{
    labels: string[];
    datasets: ChartDataset<"doughnut", number[]>[];
    plain: [string, number, Category][];
    colors: string[];
  }>({
    labels: [],
    datasets: [],
    plain: [],
    colors: [],
  });
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    getMoneyExpentByCategoryToday()
      .then((data) => {
        const { blue, red, teal, peach, mauve, yellow, pink, green, flamingo } =
          themeColors[theme];

        const colors = [
          blue,
          red,
          teal,
          peach,
          mauve,
          yellow,
          pink,
          green,
          flamingo,
        ];
        const dataArray: [string, number, Category][] = [
          ...Object.keys(data.moneyExpentByCategory).map(
            (key): [string, number, Category] => {
              const { category, money } = data.moneyExpentByCategory[key];
              return [key, money, category];
            },
          ),
        ];
        if (data.moneyWithNoCategory > 0) {
          dataArray.push([
            "Sem Categoria",
            data.moneyWithNoCategory,
            {
              id: "none",
              name: "Sem Categoria",
              precedence: 0,
              words: [],
            },
          ]);
        }
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
        const backgroundColorArray = [];
        let currentColorIndex = 0;
        for (const data of top5) {
          const [, , category] = data;
          if (category.id === "none") {
            backgroundColorArray.push(themeColors[theme].surface2);
          } else {
            backgroundColorArray.push(colors[currentColorIndex]);

            currentColorIndex++;
            if (currentColorIndex >= colors.length) {
              currentColorIndex = 0;
            }
          }
        }
        const rest = sorted.slice(5);
        const other = rest
          .map((category) => category[1])
          .reduce((accumulator, current) => accumulator + current, 0);
        let result: [string, number, Category][];
        if (other > 0) {
          result = [
            ...top5,
            [
              "Outras",
              other,
              {
                id: "other",
                name: "Outras",
                precedence: 0,
                words: [],
                iconName: "ellipsis",
              },
            ],
          ];
          backgroundColorArray.push(themeColors[theme].surface0);
        } else {
          result = top5;
        }
        const datasets: ChartDataset<"doughnut", number[]>[] = [
          {
            /*@ts-expect-error id property specified by datasetIdKey is needed for react-chartjs-2 reactivity */
            id: 1,
            label: "Dinheiro gasto",
            data: result.map((category) => category[1]),
            offset: result.length > 0 ? 16 : 0,
            backgroundColor: backgroundColorArray,
          },
        ];
        setData({
          datasets,
          labels: result.map((data) => data[0]),
          plain: result,
          colors: backgroundColorArray,
        });
      })
      .catch((e) => {
        throw e;
      });
  }, [theme]);
  return (
    <div className="category-chart">
      {empty ? (
        <span className="category-chart__empty-info">
          Nenhum gasto registrado hoje!
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
                labels: data.labels,
                datasets: data.datasets,
              }}
            />
          </div>
          <ul className="category-chart__legend">
            {data.plain.map((topCategory, i) => {
              const [name, money, category] = topCategory;
              const color = data.colors[i];
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
