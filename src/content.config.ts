import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { PagesShema, PostsShema } from "./@types/post";

const posts = defineCollection({
  loader: glob({ base: "./data/posts", pattern: "**/*.{md,mdx}" }),
  schema: PostsShema,
});

const pages = defineCollection({
  loader: glob({ base: "./data/pages", pattern: "**/*.{md,mdx}" }),
  schema: PagesShema,
});

export const collections = {
  posts,
  pages,
};
