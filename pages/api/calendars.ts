import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

type Data = {
  service_id: string
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
  start_date: number
  end_date: number
}

export default async (req: NextApiRequest, res: NextApiResponse<Array<Data>>) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const calendars: Array<Data> = await db.all("select * from calendar");

  res.json(calendars);
}
