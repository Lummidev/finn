import { use, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getMoneyExpentByCategoryAndMonthDay } from "../../../Database/ReportRepository";
import dayjs from "dayjs";
import { SettingsContext } from "../../../Context/SettingsContext";
import "./MonthChart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryIcons } from "../../../categoryIcons";
import { faQuestion, faTag } from "@fortawesome/free-solid-svg-icons";
import type { ChartDataset } from "chart.js";
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
    text: "#4c4f69",
  },
};
export const MonthChart = () => {
  const [datasets, setDatasets] = useState<
    ({
      categoryID: string;
      iconName: string;
    } & ChartDataset<"bar", number[]>)[]
  >([]);
  const [labels, setLabels] = useState<string[]>([]);
  const { settings } = use(SettingsContext);
  const theme = settings.theme;
  useEffect(() => {
    getMoneyExpentByCategoryAndMonthDay()
      .then((result) => {
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
        let nextColorIndex = 0;
        const daysInMonth = dayjs().daysInMonth();

        const labels = [];
        for (let day = 1; day <= daysInMonth; day++) {
          labels.push(day.toString());
        }
        const datasets: ({
          categoryID: string;
          iconName: string;
        } & ChartDataset<"bar", number[]>)[] = [];
        Object.keys(result)
          .sort((a, b) => {
            if (a === "Sem Categoria") {
              return 1;
            }

            if (b === "Sem Categoria") {
              return -1;
            }
            return a.localeCompare(b);
          })
          .forEach((categoryName) => {
            const label = categoryName;
            const { id, iconName, moneyExpentPerDay } = result[categoryName];
            const data = [];
            for (let day = 1; day <= daysInMonth; day++) {
              const amount = moneyExpentPerDay[day];
              data.push(amount ?? 0);
            }
            datasets.push({
              categoryID: id ?? "none",
              iconName: iconName ?? "faTag",
              label,
              borderRadius: 2,
              data,
              backgroundColor: colors[nextColorIndex],
            });
            nextColorIndex++;
            if (nextColorIndex === colors.length) {
              nextColorIndex = 0;
            }
          });
        let firstNonZeroIndex = 0;
        let lastNonZeroIndex = daysInMonth;
        for (let dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {
          let found = false;
          for (const dataset of datasets) {
            if (dataset.data[dayIndex] !== 0) {
              firstNonZeroIndex = dayIndex;
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
        for (let dayIndex = daysInMonth - 1; dayIndex >= 0; dayIndex--) {
          let found = false;
          for (const dataset of datasets) {
            if (dataset.data[dayIndex] !== 0) {
              lastNonZeroIndex = dayIndex;
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
        datasets.forEach((dataset) => {
          dataset.data = dataset.data.slice(
            firstNonZeroIndex,
            lastNonZeroIndex + 1,
          );
        });
        setLabels(labels.slice(firstNonZeroIndex, lastNonZeroIndex + 1));
        setDatasets(datasets);
      })
      .catch((e) => {
        throw e;
      });
  }, [theme]);
  return (
    <div className="month-chart">
      <ul className="month-chart__legend">
        {datasets.map((topCategory) => {
          const {
            label: name,
            iconName,
            backgroundColor: color,
            categoryID,
          } = topCategory;
          return (
            <li className="month-chart__legend-item" key={categoryID}>
              <div
                style={{
                  backgroundColor:
                    typeof color === "string" ? color : undefined,
                }}
                className="month-chart__legend-color"
              ></div>
              <span className="month-chart__legend-name">
                {iconName && (
                  <FontAwesomeIcon
                    icon={(() => {
                      if (iconName === "faTag") {
                        return faTag;
                      } else {
                        return categoryIcons[iconName]?.icon ?? faQuestion;
                      }
                    })()}
                  />
                )}
                {name}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="month-chart__container">
        <Bar
          datasetIdKey="categoryID"
          data={{
            labels,
            datasets,
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                stacked: true,
                ticks: {
                  color: themeColors[theme].text,
                  callback: (_, index) => {
                    return `${labels[index]}/${dayjs().format("MMM")}`;
                  },
                  font: () => {
                    return { weight: "bold" };
                  },
                },
                grid: {
                  color: themeColors[theme].surface0,
                },
              },
              y: {
                stacked: true,
                ticks: {
                  color: themeColors[theme].text,
                  font: () => {
                    return { weight: "bold" };
                  },
                  callback: (label) =>
                    typeof label === "number"
                      ? label.toLocaleString(undefined, {
                          style: "currency",
                          currency: "BRL",
                        })
                      : label,
                },
                grid: {
                  color: themeColors[theme].surface0,
                },
              },
            },
            color: themeColors[theme].text,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "x",
                filter: (item) => item.raw !== 0,
                callbacks: {
                  label: (context) => {
                    let label = context.dataset.label ?? "";

                    if (label) {
                      label += ": ";
                    }
                    label += new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "BRL",
                    }).format(context.parsed.y);
                    return label;
                  },
                  title: (context) => {
                    const title = context[0].label;
                    return `${title}/${dayjs().format("MMM")}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};
