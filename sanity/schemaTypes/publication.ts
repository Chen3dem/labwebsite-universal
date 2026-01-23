import { defineField, defineType } from 'sanity';

export const publication = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'doi',
      title: 'DOI',
      type: 'string',
      description: 'Digital Object Identifier (e.g. 10.1038/...)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'image',
      title: 'Publication Image',
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
      name: 'authors',
      title: 'Authors',
      type: 'string',
      description: 'Comma separated list of authors',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'journal',
      title: 'Journal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'url',
      title: 'Article URL',
      type: 'url',
    }),
    defineField({
      name: 'link',
      title: 'Article Link (Legacy)',
      type: 'url',
      hidden: true,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Research Article', value: 'research' },
          { title: 'Review', value: 'review' },
          { title: 'Preprint', value: 'preprint' },
        ],
      },
      initialValue: 'research',
    }),
  ],
});
