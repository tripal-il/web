import sqlite3 from "sqlite3";
import { open } from "sqlite";

export type Route = {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: number;
  route_url: string | null;
  route_color: string | null;
  route_text_color: string | null;
  route_sort_order: any;
  contiuous_pickup: any;
  network_id: string | number;
};

export type Trip = {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  trip_short_name: string | null;
  direction_id: number;
  block_id: string | null;
  shape_id: string;
  wheelchair_accessible: boolean | null;
  bikes_allowed: boolean | null;
};

export type Stop = {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  tts_stop_name: string | null;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  zone_id: string;
  stop_url: string | null;
  location_type: number;
  parent_station: string | null;
  stop_timezone: string | null;
  wheelchair_boarding: string | null;
  level_id: string | null;
  platform_code: string | number | null;
};

export type Agency = {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string | null;
  agency_fare_url: string | null;
  agency_email: string | null;
};

const open_db = async () => {
  return await open({ filename: "data.db", driver: sqlite3.Database });
};

export const stops = async () => {
  const db = await open_db();
  const stops = await db.all("select * from stops");

  return stops;
};
