import { defineField, defineType } from 'sanity';

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageFit',
      title: 'Image Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Show Full Image (Contain)', value: 'contain' },
          { title: 'Fill Area (Cover)', value: 'cover' },
        ],
        layout: 'radio',
      },
      initialValue: 'cover',
    }),
    defineField({
      name: 'url',
      title: 'External Link',
      type: 'url',
      description: 'Optional URL to link this news entry to (e.g. a publication or full article).',
    }),

  ],
});
