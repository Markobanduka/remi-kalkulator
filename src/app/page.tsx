"use client";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const chartConfig = {
  visitors: {
    label: "Rezultat",
  },
} satisfies ChartConfig;

const audioFilePath = "/ljuba.mp3";

const Page = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [chartData, setChartData] = useState([
    { month: "", visitors: 0, wins: 0 },
    { month: "", visitors: 0, wins: 0 },
    { month: "", visitors: 0, wins: 0 },
    { month: "", visitors: 0, wins: 0 },
  ]);
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [isNameSet, setIsNameSet] = useState(false);
  const [names, setNames] = useState<string[]>(["", "", "", ""]);
  const [showConfetti, setShowConfetti] = useState(false);

  const [previousChartData, setPreviousChartData] = useState(chartData);
  const [previousPersonIndex, setPreviousPersonIndex] =
    useState(currentPersonIndex);
  const [isUndoDisabled, setIsUndoDisabled] = useState(true);

  // const [showScores, setShowScores] = useState(true);
  // const [scoreHistory, setScoreHistory] = useState<any[]>([]);

  const minValue = Math.min(...chartData.map((item) => item.visitors));
  const maxValue = Math.max(...chartData.map((item) => item.visitors));

  // Handle name change during the setup
  const handleNameChange = (index: number, value: string) => {
    setNames((prevNames) => {
      const updatedNames = [...prevNames];
      updatedNames[index] = value;
      return updatedNames;
    });
  };

  // Handle removing a player during the setup
  const handleRemovePlayer = (index: number) => {
    if (names.length > 1) {
      setNames((prevNames) => prevNames.filter((_, i) => i !== index));
      setChartData((prevChartData) =>
        prevChartData.filter((_, i) => i !== index)
      );
    }
  };

  // Handle adding names to chart data after setup
  const handleSetNames = () => {
    setChartData(
      chartData.map((item, index) => ({
        ...item,
        month: names[index] || `Igrač ${index + 1}`,
      }))
    );
    // setScoreHistory((prevHistory) => [
    //   ...prevHistory,
    //   chartData.map((item) => item.visitors),
    // ]);

    setIsNameSet(true);
  };
  const handleInputChange = (month: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setInputValues((prev) => ({ ...prev, [month]: numValue }));
  };
  // useEffect(() => {
  //   if (chartData.length > 0) {
  //     setScoreHistory((prevHistory) => [
  //       ...prevHistory,
  //       chartData.map((item) => item.visitors),
  //     ]);
  //   }
  // }, [chartData]);

  const handleSubmit = () => {
    setPreviousChartData([...chartData]);
    const updatedChartData = chartData.map((item) => {
      const updatedVisitors = item.visitors + (inputValues[item.month] || 0);

      let newWins = item.wins;
      if (inputValues[item.month] < 0) {
        newWins += 1;
      }
      return {
        ...item,
        visitors: updatedVisitors,
        wins: newWins,
      };
    });

    // setChartData(updatedChartData);

    setChartData(updatedChartData);
    setInputValues({});
    setPreviousPersonIndex(currentPersonIndex);
    setCurrentPersonIndex((prevIndex) => (prevIndex + 1) % chartData.length);
    setIsUndoDisabled(false);
  };

  const handleUndo = () => {
    setChartData(previousChartData);
    setCurrentPersonIndex(previousPersonIndex);
    setIsUndoDisabled(true);
  };

  const scheduleAlertAt11PM = () => {
    const now = new Date();
    const alertTime = new Date();
    alertTime.setHours(23, 0, 0, 0);

    if (now > alertTime) {
      alertTime.setDate(alertTime.getDate() + 1);
    }

    const timeUntil11PM = alertTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      const winner = chartData.find(
        (item) => item.visitors === minValue
      )?.month;

      setShowConfetti(true);

      alert(`Cestitamo ${winner} je pobedio/la sa ${minValue} poena!`);
      if (audio) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }

      setTimeout(() => setShowConfetti(false), 25000);
    }, timeUntil11PM);

    // Return the timeout ID for cleanup
    return timeoutId;
  };
  useEffect(() => {
    // Initialize audio only on the client side
    const audioInstance = new Audio(audioFilePath);
    setAudio(audioInstance);

    if (isNameSet) {
      const timeoutId = scheduleAlertAt11PM();
      return () => clearTimeout(timeoutId);
    }
  }, [isNameSet, chartData]); // Re-run if names are set or data changes

  return (
    <div className="flex justify-center items-center h-screen">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          {!isNameSet ? (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {names.map((name, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 col-span-4 md:col-span-2 lg:col-span-1 bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor={`name-input-${index}`}
                      className="font-semibold text-gray-700"
                    >
                      Igrač {index + 1}
                    </Label>
                    {names.length > 1 && (
                      <button
                        className="text-red-500 bg-gray-100 hover:bg-red-100 focus:ring-2 focus:ring-red-300 transition-all duration-150 ease-in-out px-2 py-1 rounded-md font-bold"
                        onClick={() => handleRemovePlayer(index)}
                        aria-label={`Remove player ${index + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <Input
                    id={`name-input-${index}`}
                    type="text"
                    placeholder={`Unesi ime igrača ${index + 1}`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              ))}
              <Button
                onClick={handleSetNames}
                className="w-full mt-4 col-span-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md shadow-md transition-all duration-150 ease-in-out"
              >
                Počni igru
              </Button>
            </div>
          ) : (
            <>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  height={300}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(210, 100%, 50%)",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    tickCount={4}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel hideIndicator />}
                  />
                  <Bar dataKey="visitors" minPointSize={40}>
                    <LabelList
                      dataKey="visitors"
                      position="center"
                      fill="hsl(var(--primary-foreground))"
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    />
                    {chartData.map((item) => (
                      <Cell
                        key={item.month}
                        fill={
                          item.visitors === minValue
                            ? "hsl(var(--primary))"
                            : item.visitors === maxValue
                            ? "hsl(var(--destructive))"
                            : "hsl(var(--blue))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
              <div className="grid grid-cols-4 gap-4 mt-6">
                {chartData.map((item, index) => (
                  <div
                    key={item.month}
                    className={`flex flex-col space-y-2 p-2 ${
                      index === currentPersonIndex
                        ? "border-4 border-dashed border-green-500"
                        : "border border-gray-300"
                    }`}
                  >
                    <Label htmlFor={`input-${item.month}`}>{item.month}</Label>
                    <Input
                      id={`input-${item.month}`}
                      type="number"
                      placeholder="Unesi"
                      value={inputValues[item.month] || ""}
                      onChange={(e) =>
                        handleInputChange(item.month, e.target.value)
                      }
                    />
                    <div className="text-sm text-gray-500 font-bold">
                      Pobede: {item.wins}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4 mt-4">
                <Button onClick={handleSubmit} className="w-full">
                  Izracunaj
                </Button>
                <Button
                  onClick={handleUndo}
                  className="w-1/6 bg-yellow-500 hover:bg-yellow-400"
                  disabled={isUndoDisabled}
                >
                  <RotateCcw />
                </Button>
              </div>
              {/* {showScores && (
                <div className="mt-4">
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        {names.map((name, index) => (
                          <th
                            key={index}
                            className="border px-4 py-2 text-center"
                          >
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scoreHistory.map((scoreRow, rowIndex) => (
                        <tr key={rowIndex}>
                          {scoreRow.map((score, index) => (
                            <td
                              key={index}
                              className="border px-4 py-2 text-center"
                            >
                              {score} poena
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )} */}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
