import fetch from "node-fetch";

export type MonitoredCall = {
  StopPointRef: string;
  Order: string;
  ExpectedArrivalTime: string;
  DistanceFromStop: string;
};

export type FramedVehicleJourneyRef = {
  DataFrameRef: string;
  DatedVehicleJourneyRef: string;
};

export type MonitoredVehicleJourney = {
  LineRef: string;
  DirectionRef: string;
  FramedVehicleJourneyRef: FramedVehicleJourneyRef;
  PublishedLineName: string;
  OperatorRef: string;
  DestinationRef: string;
  OriginAimedDepartureTime: string;
  ConfidenceLevel: string;
  VehicleLocation: { Longitude: string; Latitude: string };
  Bearing: string;
  Velocity: string;
  VehicleRef: string;
  MonitoredCall: MonitoredCall;
  operatorName: string; // custom
  destinationName: string; // custom
};

export type MonitoredStopVisit = {
  RecordedAtTime: string;
  ItemIdentifier: string;
  MonitoringRef: string;
  MonitoredVehicleJourney: MonitoredVehicleJourney;
};

export type StopMonitoringDelivery = {
  "-version": string;
  ReponseTimestamp: string;
  Status: string;
  MonitoredStopVisit: Array<MonitoredStopVisit>;
};

export type ServiceDelivery = {
  ResponseTimestamp: string;
  ProducerRef: string;
  ReponseMessageIdentifier: string;
  RequestMessageRef: string;
  Status: string;
  StopMonitoringDelivery: Array<StopMonitoringDelivery>;
};

export type Siri = {
  ServiceDelivery: ServiceDelivery;
};

export type Data = {
  Siri: Siri;
};

const GTFS_RT_KEY = process.env["GTFS_RT_KEY"];
const BASE_URL = `http://moran.mot.gov.il:110/Channels/HTTPChannel/SmQuery/2.8/json?Key=${GTFS_RT_KEY}`;

export const stop_schedule = async (stop_id: string) => {
  const req = await fetch(BASE_URL + `&MonitoringRef=${stop_id}`);
  const res = (await req.json()) as Data;

  return res;
};

export const line_schedule = async (line_ref: string) => {
  const req = await fetch(BASE_URL + `&MonitoringRef=all&LineRef=${line_ref}`);
  const res = (await req.json()) as Data;

  return res;
};

export const line_arrival = async (line_ref: string, stop_id: string) => {
  const req = await fetch(
    BASE_URL + `&MonitoringRef=${stop_id}&LineRef=${line_ref}`,
  );
  const res = (await req.json()) as Data;

  return res;
};
