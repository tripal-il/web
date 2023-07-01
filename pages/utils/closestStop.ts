function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function calculateDistance(lat1: any, lon1: any, lat2: number, lon2: number) {
  const earthRadius = 6371;
  const dLat = degToRad(lat2-lat1);
  const dLon = degToRad(lon2-lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = earthRadius * c;

  return distance;
}