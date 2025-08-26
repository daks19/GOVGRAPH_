
const BASE = 'https://api.data.gov.in/resource';

export default async function handler(req: any, res: any) {
  const { resource_id } = req.query;
  if (typeof resource_id !== 'string') {
    return res.status(400).json({ error: 'resource_id param required' });
  }
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'DATA_GOV_API_KEY not configured' });
  }
  try {
    const url = `${BASE}/${resource_id}?api-key=${apiKey}&format=json&limit=10`;
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Upstream error', status: r.status });
    }
    const json = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800');
    return res.status(200).json(json);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}
