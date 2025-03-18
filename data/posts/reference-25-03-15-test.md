---
title: 'Second post'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 09 2022'
heroImage: '/test.png'
category: 'reference'
---

## Projekt

I see the issue. We can't directly export the JSON file as a collection. Let's go back to using the collection definition properly:

```typescript:src/content.config.ts
import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const footerCollection = defineCollection({
  loader: file("./data/pageData/footer.json", {
    parser: (text) => {
      return JSON.parse(text);
    },
  }),
  schema: z.array(z.object({
    id: z.enum(['links', 'social']),
    data: z.array(z.object({
      title: z.string(),
      url: z.string()
    })),
    filePath: z.string(),
    collection: z.string()
  }))
});

const posts = defineCollection({
  loader: glob({ base: "./data/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  footer: footerCollection,
  posts,
};
```
I've restored the proper collection definition with:
1. A proper `defineCollection` call for the footer data
2. The loader that reads and parses the JSON file
3. The schema that matches the structure we expect
4. Proper export in the collections object

This should resolve the syntax error and allow Astro to properly load and validate your footer data. You should now be able to use `getCollection("footer")` in your components again. Let me know if you need any help using the data in your components!
 
