import { defineField, defineType } from 'sanity';

export const homePage = defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            description: 'The large image displayed on the right side of the home page hero section.',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'heroImages',
            title: 'Hero Slideshow Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            description: 'Optional: Upload multiple images to create a slideshow. If provided, this overrides the single "Hero Image".',
        }),
        defineField({
            name: 'heroImageFit',
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
            description: 'Choose "Contain" to see the whole image (may show background). Choose "Cover" to fill the entire box (may crop edges).',
        }),
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
            description: 'Optional: Overrides the default hero title ("Deciphering...")',
        }),
    ],
    preview: {
        select: {
            title: 'heroTitle',
            media: 'heroImage',
        },
        prepare(selection) {
            return { ...selection, title: 'Home Page Settings' };
        },
    },
});
