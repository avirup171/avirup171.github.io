import { getCollection, getEntry, type CollectionKey } from 'astro:content';

/** Entries in the order they appear in their JSON file. */
async function inFileOrder<C extends Exclude<CollectionKey, 'profile'>>(name: C) {
  return (await getCollection(name)).sort((a, b) => a.id.localeCompare(b.id)).map((e) => e.data);
}

/** The single profile entry. Throws (failing the build) if it's missing. */
export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('src/data/profile.json is missing or empty.');
  return entry.data;
}

/** Links sorted newest first, with featured entries split out. */
export async function getLinks() {
  const all = (await getCollection('links'))
    .map((e) => e.data)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  return {
    featured: all.filter((l) => l.featured),
    rest: all.filter((l) => !l.featured),
  };
}

export async function getReviews() {
  return inFileOrder('reviews');
}

/** Books, newest first. */
export async function getBooks() {
  return (await getCollection('books')).map((e) => e.data).sort((a, b) => b.year - a.year);
}

/** Projects: featured first, then in file order. */
export async function getProjects() {
  const all = await inFileOrder('projects');
  return [...all.filter((p) => p.featured), ...all.filter((p) => !p.featured)];
}
