import { makeOverview, listSectors } from '../_chartsData';

export default function handler(_req: any, res: any) {
  const overview = makeOverview();
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
  return res.status(200).json({ overview, sectors: listSectors() });
}
