const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function fetchAPI(path: string) {
  const url = `${BASE_URL}/api${path}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch from Strapi");
  }

  return res.json();
}
