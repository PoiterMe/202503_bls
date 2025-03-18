import { z } from "astro:content";

const PostCategory = z.enum(["reference", "blog"]);

export const PostsShema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  category: PostCategory,
});

export const PagesShema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
});

export type Post = z.infer<typeof PostsShema>;
export type PostCategory = z.infer<typeof PostCategory>;
