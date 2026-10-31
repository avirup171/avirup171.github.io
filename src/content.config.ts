import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every editable piece of content lives in src/data/*.json.
 * Each file has a schema here, so a malformed entry fails `npm run build`.
 *
 * The JSON files stay plain (no `id` fields to maintain): the parsers below
 * assign ids at load time.
 */

// Ids are prefixed with the entry's position, so sorting by id keeps file order.
const withIds =
  (key: (item: Record<string, unknown>, i: number) => string) => (text: string) =>
    (JSON.parse(text) as Record<string, unknown>[]).map((item, i) => ({
      id: `${String(i).padStart(3, '0')}-${key(item, i)}`,
      ...item,
    }));

const profile = defineCollection({
  loader: file('src/data/profile.json', {
    parser: (text) => [{ id: 'profile', ...JSON.parse(text) }],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      title: z.string().min(1),
      jobTitle: z.string().min(1),
      company: z.string().min(1),
      companyUrl: z.union([z.url(), z.literal('')]).default(''),
      location: z.string().min(1),
      url: z.url(),
      image: image(),
      tagline: z.string().min(1),
      // Used as the homepage meta description: aim for ~150 characters.
      description: z.string().min(50).max(170),
      bio: z.array(z.string().min(1)).min(1),
      knowsAbout: z.array(z.string().min(1)),
      email: z.union([z.email(), z.literal('')]).default(''),
      // Every profile URL is also emitted as schema.org `sameAs`.
      profiles: z
        .array(
          z.object({
            label: z.string().min(1),
            url: z.url(),
            // true = shown under "Writing" as a place to read posts.
            writing: z.boolean().default(false),
          }),
        )
        .min(1),
    }),
});

const links = defineCollection({
  loader: file('src/data/links.json', { parser: withIds((item) => String(item.url)) }),
  schema: z.object({
    title: z.string().min(1),
    url: z.url(),
    platform: z.string().min(1),
    date: z.coerce.date(),
    // 1–2 sentences: this is the site's indexable text for each post.
    summary: z.string().min(20).max(320),
    featured: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: file('src/data/reviews.json', { parser: withIds((item) => String(item.name)) }),
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    quote: z.string().min(1),
    link: z.url().optional(),
  }),
});

const books = defineCollection({
  loader: file('src/data/books.json', { parser: withIds((item) => String(item.isbn ?? item.title)) }),
  schema: z.object({
    title: z.string().min(1),
    publisher: z.string().min(1),
    year: z.number().int(),
    isbn: z.string().regex(/^\d{10}(\d{3})?$/).optional(),
    url: z.url().optional(),
    summary: z.string().min(20).max(320),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.json', { parser: withIds((item) => String(item.name)) }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(1),
        // 1–2 sentences: indexable text, like link summaries.
        summary: z.string().min(20).max(360),
        tech: z.array(z.string().min(1)).default([]),
        repo: z.url().optional(),
        // Main link for people who want to use it (download, demo, store page).
        url: z.url().optional(),
        urlLabel: z.string().min(1).default('Visit'),
        // Path relative to this JSON file, e.g. "../assets/projects/foo.jpg".
        image: image().optional(),
        imageAlt: z.string().min(1).optional(),
        featured: z.boolean().default(false),
      })
      .refine((p) => !p.image || p.imageAlt, {
        message: 'imageAlt is required when image is set',
        path: ['imageAlt'],
      }),
});

export const collections = { profile, links, reviews, books, projects };
