import { defineField, defineType } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Principal Investigator', value: 'pi' },
          { title: 'Postdoctoral Fellow', value: 'postdoc' },
          { title: 'Professional Research Assistant', value: 'pra' },
          { title: 'PhD Student', value: 'phd' },
          { title: 'Master Student', value: 'master' },
          { title: 'Undergraduate', value: 'undergrad' },
          { title: 'Staff', value: 'staff' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'About Me',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
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
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
  ],
});
