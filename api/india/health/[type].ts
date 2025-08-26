
const healthTypes = ['mortality', 'life_expectancy', 'immunization'];

export default function handler(req: any, res: any) {
  const { type } = req.query;
  if (typeof type !== 'string') return res.status(400).json({ error: 'type param required' });
  if (!healthTypes.includes(type)) {
    return res.status(404).json({ error: 'Unknown type', accepted: healthTypes });
  }
  const seed = type.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 101;
  const years = Array.from({ length: 10 }, (_, i) => 2014 + i);
  const series = years.map((_, i) => 50 + ((seed * (i + 3)) % 45));
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=900');
  return res.status(200).json({ type, years, values: series });
}
