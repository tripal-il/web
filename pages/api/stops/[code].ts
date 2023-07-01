import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

import type { Stop } from '.'

type StopError = {
  error: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Stop | StopError>) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const stop_code = req.query['code'];
  const stop = await db.get("select * from stops where stop_code = ?", stop_code);

  if (stop) {
    res.json(stop);
  } else {
    res.json({ error: 'Stop not found!' });
  }
}