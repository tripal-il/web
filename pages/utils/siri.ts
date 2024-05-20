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