import type { NextApiRequest, NextApiResponse } from 'next'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export type Route = {
  route_id: string
  agency_id: string
  route_short_name: string
  route_long_name: string
  route_desc: string
  route_type: number
  route_url: string | null
  route_color: string | null
  route_text_color: string | null
  route_sort_order: any
  contiuous_pickup: any
  network_id: string | number
}

export default async (req: NextApiRequest, res: NextApiResponse<Array<Route>>) => {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const routes = await db.all("select * from routes");

  res.json(routes);
}
