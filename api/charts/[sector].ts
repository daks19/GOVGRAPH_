import { makeSectorChart, listSectors } from '../_chartsData';

export default function handler(req: any, res: any) {
  const { sector } = req.query;
  if (typeof sector !== 'string') {
    return res.status(400).json({ error: 'sector param required' });
  }
  const sectors = listSectors();
  if (!sectors.includes(sector)) {
    return res.status(404).json({ error: 'Unknown sector', sectors });
  }
  const payload = makeSectorChart(sector);
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(payload);
}
