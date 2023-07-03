import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export type Trip = {
  route_id: string
  service_id: string
  trip_id: string
  trip_headsign: string
  trip_short_name: string | null
  direction_id: number
  block_id: string | null
  shape_id: string
  wheelchair_accessible: boolean | null
  bikes_allowed: boolean | null
}

export default async (req: NextApiRequest, res: NextApiResponse<Array<Trip>>) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const trips = await db.all("select * from trips");

  res.json(trips);
}
