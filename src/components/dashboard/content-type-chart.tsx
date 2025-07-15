
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Content } from "@/lib/types";

interface ContentTypeChartProps {
    contents: Content[];
}

export function ContentTypeChart({ contents }: ContentTypeChartProps) {
    const data = React.useMemo(() => {
        return [
          {
            name: "영상",
            total: contents.filter(c => c.category === '영상').length,
          },
          {
            name: "스크립트",
            total: contents.filter(c => c.category === '스크립트').length,
          },
          {
            name: "팟캐스트",
            total: contents.filter(c => c.category === '팟캐스트').length,
          },
          {
            name: "아티클",
            total: contents.filter(c => c.category === '아티클').length,
          },
            {
            name: "채널 기획",
            total: contents.filter(c => c.category === '채널 기획').length,
          },
        ]
    }, [contents]);


    if (contents.length === 0) {
        return (
             <div className="flex h-[250px] items-center justify-center text-muted-foreground">
              표시할 데이터가 없습니다.
            </div>
        )
    }
  return (
    <div className="h-[250px]">
        <ChartContainer config={{}} className="h-full w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
         <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
      </ChartContainer>
    </div>
  )
}
