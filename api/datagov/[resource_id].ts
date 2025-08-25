import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const resource_id = req.query.resource_id as string;
  const limit = (req.query.limit as string) || '100';
  const offset = (req.query.offset as string) || '0';
  if (!resource_id) return res.status(400).json({ error: 'resource_id required' });

  try {
    const response = await axios.get(`https://api.data.gov.in/resource/${resource_id}`, {
      params: {
        format: 'json',
        limit,
        offset,
        'api-key': process.env.DATA_GOV_API_KEY
      },
      timeout: 10000
    });
    const records = response.data?.records || [];
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(records);
  } catch (err: any) {
    console.error('datagov fetch error', err?.message);
    return res.status(200).json([]); // graceful empty fallback
  }
}
