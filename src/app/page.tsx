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

const initialChartData = [
  { month: "OLIVERA", visitors: 0 },
  { month: "DJUKI", visitors: 0 },
  { month: "JULKA", visitors: 0 },
  { month: "MILUN", visitors: 0 },
];

const chartConfig = {
  visitors: {
    label: "Rezultat",
  },
} satisfies ChartConfig;
const Page = () => {
  const [chartData, setChartData] = useState(initialChartData);
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});
  const minValue = Math.min(...chartData.map((item) => item.visitors));

  const handleInputChange = (month: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setInputValues((prev) => ({ ...prev, [month]: numValue }));
  };

  const handleSubmit = () => {
    setChartData((prevData) =>
      prevData.map((item) => ({
        ...item,
        visitors: item.visitors + (inputValues[item.month] || 0),
      }))
    );
    setInputValues({});
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
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
            {chartData.map((item) => (
              <div key={item.month} className="flex flex-col space-y-2">
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
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} className="w-full mt-4">
            Izracunaj
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
