import { defineField, defineType } from 'sanity';

export const protocol = defineType({
    name: 'protocol',
    title: 'Protocol / Manual',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    'General',
                    'Biological',
                    'Equipment',
                    'Safety',
                    'Other'
                ],
            },
            validation: (Rule) => Rule.required(),
            initialValue: 'General'
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'versions',
            title: 'Versions',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'version', type: 'string', title: 'Version (e.g., v1.0)' },
                    { name: 'file', type: 'file', title: 'File', options: { accept: '.pdf' } },
                    { name: 'uploadedAt', type: 'datetime', title: 'Uploaded At', initialValue: () => new Date().toISOString() },
                    { name: 'notes', type: 'text', title: 'Change Notes', rows: 2 }
                ],
                preview: {
                    select: {
                        title: 'version',
                        subtitle: 'uploadedAt'
                    }
                }
            }]
        }),
        defineField({
            name: 'link',
            title: 'External Link',
            type: 'url',
            description: 'Link to an external protocol (e.g. Google Doc, Benchling).'
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category'
        }
    }
});
