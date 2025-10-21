import { use, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getMoneyExpentByCategoryAndMonthDay } from "../../../Database/ReportRepository";
import { type ChartDataset } from "chart.js";
import dayjs from "dayjs";
import { SettingsContext } from "../../../Context/SettingsContext";
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
    ChartDataset<"bar", (number | [number, number] | null)[]>[]
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
        const datasets: ChartDataset<
          "bar",
          (number | [number, number] | null)[]
        >[] = [];
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
            const amountExpentByDay = result[categoryName];
            const data = [];
            for (let day = 1; day <= daysInMonth; day++) {
              const amount = amountExpentByDay[day];
              data.push(amount ?? 0);
            }
            datasets.push({
              id: label,
              label,
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
      <Bar
        datasetIdKey="id"
        data={{
          labels,
          datasets,
        }}
        options={{
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: themeColors[theme].text,
                callback: (value, index) => {
                  return `${labels[index]}/${dayjs().format("MMM")}`;
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
              labels: {
                color: themeColors[theme].text,
              },
            },
            tooltip: {
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
              },
            },
          },
        }}
      />
    </div>
  );
};
