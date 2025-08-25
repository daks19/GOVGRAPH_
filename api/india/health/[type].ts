import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getIndianHealthData } from '../../_chartsData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const type = req.query.type as string;
  const data = getIndianHealthData(type || '');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).json(data);
}
