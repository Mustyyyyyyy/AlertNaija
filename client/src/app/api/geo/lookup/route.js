export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return Response.json({ message: "lat and lng required" }, { status: 400 });
  }

  const latf = parseFloat(lat);
  const lngf = parseFloat(lng);
  const distance = Math.sqrt(Math.pow(latf - 9.082, 2) + Math.pow(lngf - 7.396, 2));

  if (distance < 0.5) {
    return Response.json({ state: "Abuja/FCT", approx: true });
  }
  return Response.json({ state: "Nigeria", approx: true });
}