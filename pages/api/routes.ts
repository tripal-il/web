import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// type Data = {
//   name: string
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const routes = await db.all("select * from routes");

  res.json(routes);
}
