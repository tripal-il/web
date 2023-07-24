import type { NextApiRequest, NextApiResponse } from 'next'
import type { Trip } from '../trips'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Route } from '../routes'

export type Shape = {
  shape_id: string
  shape_pt_lat: number
  shape_pt_lon: number
  shape_pt_sequence: number
  shape_dist_traveled: any
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const route_id = req.query['route_id'];
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  const route = await db.get('select * from routes where route_id = ?', route_id) as Route;
  const trip = await db.get('select * from trips where route_id = ?', route.route_id) as Trip;
  const shape_id = trip.shape_id;

  const shapes = await db.all('select * from shapes where shape_id = ?', shape_id);
  res.json(shapes);
}