import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export type Stop = {
  stop_id: string
  stop_code: string
  stop_name: string
  tts_stop_name: string | null
  stop_desc: string
  stop_lat: number
  stop_lon: number
  zone_id: string
  stop_url: string | null
  location_type: number
  parent_station: string | null
  stop_timezone: string | null
  wheelchair_boarding: string | null
  level_id: string | null
  platform_code: string | number | null
}

export default async (req: NextApiRequest, res: NextApiResponse<Array<Stop>>) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const stops = await db.all("select * from stops");

  res.json(stops);
}
