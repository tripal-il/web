import sqlite3 from "sqlite3";
import { open } from "sqlite";

export type Shape = {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled: any;
};

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

export const route_shapes = async (route_id: string) => {
  const db = await open_db();
  const route = (await db.get(
    "select * from routes where route_id = ?",
    route_id,
  )) as Route;
  const trip = (await db.get(
    "select * from trips where route_id = ?",
    route.route_id,
  )) as Trip;
  const shape_id = trip.shape_id;

  const shapes = await db.all(
    "select * from shapes where shape_id = ?",
    shape_id,
  );

  return shapes;
};

export const stop_times_trip = async (trip_id: string) => {
  const db = await open_db();
  const stop_times = await db.all(
    "select * from stop_times where trip_id = ?",
    trip_id,
  );

  return stop_times;
};

export const stops = async () => {
  const db = await open_db();
  const stops = await db.all("select * from stops");

  return stops;
};

export const stop_by_id = async (stop_code: string) => {
  const db = await open_db();
  const stop = (await db.all(
    "select * from stops where stop_code = ?",
    stop_code,
  )) as Stop;

  return stop.stop_name;
};

export const agencies = async () => {
  const db = await open_db();
  const agencies = await db.all("select * from agency");

  return agencies;
};

export const agency_by_id = async (agency_id: string) => {
  const db = await open_db();
  const agency = (await db.all(
    "select * from agency where agency_id = ?",
    agency_id,
  )) as Agency;

  return agency.agency_name;
};

export const routes = async () => {
  const db = await open_db();
  const routes = await db.all("select * from routes");

  return routes;
};

export const trips = async () => {
  const db = await open_db();
  const trips = await db.all("select * from trips");

  return trips;
};
