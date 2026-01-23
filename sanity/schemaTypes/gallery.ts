import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'gallery',
    title: 'News & Fun Gallery',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'url',
            title: 'External Link',
            type: 'url',
            description: 'Optional URL to link this gallery image to.',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
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
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
        },
    },
})
