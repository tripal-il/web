import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export type StopTime = {
  trip_id: string
  arrival_time: string
  arrival_timestamp: number
  departure_time: string
  departure_timestamp: number
  stop_id: string
  stop_sequence: number
  stop_headsign: string | null
  pickup_type: number
  drop_off_type: number
  continuous_pickup: number | null
  continuous_drop_off: number | null
  shape_dist_traveled: number | null
  timepoint: number | null
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const trip_id = req.query['trip_id'];
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const stop_times = await db.all("select * from stop_times where trip_id = ?", trip_id);

  res.json(stop_times);
}
