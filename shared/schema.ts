import { z } from "zod";

export const chartDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  source: z.string(),
  sector: z.enum(['agriculture', 'healthcare', 'education', 'budget', 'traffic', 'utilities']),
  type: z.enum(['line', 'bar', 'pie', 'doughnut']),
  data: z.object({
    labels: z.array(z.string()),
    datasets: z.array(z.object({
      label: z.string(),
      data: z.array(z.number()),
      backgroundColor: z.union([z.string(), z.array(z.string())]).optional(),
      borderColor: z.union([z.string(), z.array(z.string())]).optional(),
      borderWidth: z.number().optional(),
      fill: z.boolean().optional(),
      tension: z.number().optional(),
    }))
  }),
  lastUpdated: z.string(),
});

export const sectorDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  charts: z.array(chartDataSchema),
});

export type ChartData = z.infer<typeof chartDataSchema>;
export type SectorData = z.infer<typeof sectorDataSchema>;
