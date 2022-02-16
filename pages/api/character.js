// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fsp = require('fs').promises;

const CHARACTER_DB = require('../../generated_assets/character.json');

export default async function handler(req, res) {
  const { ids } = req.query
  const character_ids = ids.split(',');

  res.status(200).json({ units: CHARACTER_DB.units.filter(unit => character_ids.includes(String(unit.id))) })
}
