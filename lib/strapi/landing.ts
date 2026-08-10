// /lib/api/landing.ts
import { fetchAPI } from "./strapi";

export async function getLandingPage() {
  const response = await fetchAPI(`/landing-page?populate=*`);

  console.log("response", response);

  return response?.data;
}
