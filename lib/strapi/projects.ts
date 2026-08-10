// /lib/api/projects.ts
import { fetchAPI } from "./strapi";

export async function getAllProjects() {
  const res = await fetchAPI(`/projects?fields=name,slug`);
  console.log("res", res);

  return res.data;
}
