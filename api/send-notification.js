export default async function handler(_req, res) {
  return res.status(410).json({ error: "route_retired" });
}

