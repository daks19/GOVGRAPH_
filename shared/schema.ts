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

// Basic user schema (expand as needed across app)
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(), // store hashed password in production
});

export const insertUserSchema = userSchema.omit({ id: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
