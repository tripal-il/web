const averageWalkingSpeed: number = 4.54;

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function calculateDistance(lat1: any, lon1: any, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

export function walkingTime(distance: number): string {
  let t = distance/averageWalkingSpeed;
  if (t < 1) {
    t = t*60;
    let ty = (t.toFixed(0) === "1") ? 'minute' : 'minutes';
    return `${t.toFixed(0)} ${ty} walk`
  } else {
    let ty = (t.toFixed(0) === "1") ? 'hour' : 'hours';
    return `${t.toFixed(0)} ${ty} walk`;
  }
}