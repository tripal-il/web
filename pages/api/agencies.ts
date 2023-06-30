import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

type Data = {
  agency_id: string
  agency_name: string
  agency_url: string
  agency_timezone: string
  agency_lang: string
  agency_phone: string | null
  agency_fare_url: string | null
  agency_email: string | null
}

export default async (req: NextApiRequest, res: NextApiResponse<Array<Data>>) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const agencies: Array<Data> = await db.all("select * from agency");

  res.json(agencies);
}
