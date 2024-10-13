"use client";

import { useState } from "react";
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

const Page = () => {
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

  const minValue = Math.min(...chartData.map((item) => item.visitors));

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
        month: names[index] || `Person ${index + 1}`,
      }))
    );
    setIsNameSet(true);
  };

  const handleInputChange = (month: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setInputValues((prev) => ({ ...prev, [month]: numValue }));
  };

  const handleSubmit = () => {
    const updatedChartData = chartData.map((item) => {
      const updatedVisitors = item.visitors + (inputValues[item.month] || 0);

      console.log(inputValues[item.month]);

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

    setChartData(updatedChartData);
    setInputValues({});
    setCurrentPersonIndex((prevIndex) => (prevIndex + 1) % chartData.length);
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          {!isNameSet ? (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {names.map((name, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`name-input-${index}`}>
                      Igrač {index + 1}
                    </Label>
                    {names.length > 1 && (
                      <button
                        className="text-red-500"
                        onClick={() => handleRemovePlayer(index)}
                      >
                        X
                      </button>
                    )}
                  </div>
                  <Input
                    id={`name-input-${index}`}
                    type="text"
                    placeholder={`Unesi ime igrača ${index + 1}`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                  />
                </div>
              ))}
              <Button
                onClick={handleSetNames}
                className="w-full mt-4 col-span-4"
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
                            ? "hsl(var(--destructive))"
                            : "hsl(var(--primary))"
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
                        ? "border-2 border-green-500"
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
              <Button onClick={handleSubmit} className="w-full mt-4">
                Izracunaj
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
