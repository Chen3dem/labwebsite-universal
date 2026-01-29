import { defineField, defineType, defineArrayMember } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'labName',
      title: 'Lab Name',
      type: 'string',
      description: 'The name of the lab (e.g., "The Generic Lab")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'The lab logo used in the navbar and footer',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO',
          initialValue: 'Lab Logo',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'institutionLogo',
      title: 'Institution Logo',
      type: 'image',
      description: 'The logo of your university or institution (displayed in footer and contact page)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'A short description of the lab for SEO and footer (e.g., "Deciphering Cellular Signaling...")',
    }),
    defineField({
      name: 'footerAddress',
      title: 'Footer Address',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lines of text for the address in the footer',
    }),
    defineField({
      name: 'researchIntro',
      title: 'Research Page Intro',
      type: 'text',
      description: 'Introduction text for the Research page',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (rule) => rule.email(),
      description: 'Public facing email for the "Connect" section',
    }),
    defineField({
      name: 'managerEmail',
      title: 'Lab Manager Email',
      type: 'string',
      validation: (rule) => rule.email(),
      description: 'Internal email for receiving order requests, repairs, and system backups.',
    }),
    defineField({
      name: 'socialKey',
      title: 'Social Media Links',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'socialLink',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform Name',
              type: 'string',
              options: {
                list: ['LinkedIn', 'Twitter / X', 'Bluesky', 'GitHub', 'Instagram', 'Other'],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'quickLinks',
      title: 'Footer Quick Links',
      type: 'array',
      description: 'Links to external resources (e.g. Protocols.io, Benchling, etc.)',
      of: [
        defineArrayMember({
          name: 'quickLink',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'joinUs',
      title: 'Join Us Section',
      type: 'object',
      description: 'Configuration for the "Join Us" section on the Contact page',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'JOIN US',
        }),
        defineField({
          name: 'introText',
          title: 'Intro Text',
          type: 'text',
          rows: 3,
          description: 'A brief introduction (e.g., "We are looking for motivated scientists...")',
        }),
        defineField({
          name: 'openPositions',
          title: 'Open Positions',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'position',
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Position Title',
                  type: 'string',
                  description: 'e.g., "Postdoctoral Fellows"',
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'labName',
    },
    prepare({ title }) {
      return {
        title: title || 'Site Settings',
      };
    },
  },
});
