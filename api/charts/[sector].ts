import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAgricultureCharts, getHealthcareCharts, getEducationCharts, getBudgetCharts, getTrafficCharts, getUtilitiesCharts } from '../_chartsData';

const handlers: Record<string, () => Promise<any[]>> = {
  agriculture: getAgricultureCharts,
  healthcare: getHealthcareCharts,
  education: getEducationCharts,
  budget: getBudgetCharts,
  traffic: getTrafficCharts,
  utilities: getUtilitiesCharts,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const sector = req.query.sector as string;
  const fn = handlers[sector];
  if (!fn) return res.status(404).json({ error: 'Sector not found' });
  try {
    const charts = await fn();
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
    return res.status(200).json(charts);
  } catch (e: any) {
    console.error('charts handler error', e?.message);
    return res.status(500).json({ error: 'Failed to fetch chart data' });
  }
}
