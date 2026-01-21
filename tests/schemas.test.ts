import { researchProject } from '../sanity/schemaTypes/researchProject';
import { publication } from '../sanity/schemaTypes/publication';
import { teamMember } from '../sanity/schemaTypes/teamMember';

describe('Research Project Schema', () => {
  it('has the correct name and title', () => {
    expect(researchProject.name).toBe('researchProject');
    expect(researchProject.title).toBe('Research Project');
  });

  it('contains all required fields', () => {
    const fieldNames = researchProject.fields.map(f => f.name);
    expect(fieldNames).toContain('title');
    expect(fieldNames).toContain('slug');
    expect(fieldNames).toContain('summary');
    expect(fieldNames).toContain('mainImage');
    expect(fieldNames).toContain('description');
  });
});

describe('Publication Schema', () => {
  it('has the correct name and title', () => {
    expect(publication.name).toBe('publication');
    expect(publication.title).toBe('Publication');
  });

  it('contains all required fields', () => {
    const fieldNames = publication.fields.map(f => f.name);
    expect(fieldNames).toContain('title');
    expect(fieldNames).toContain('authors');
    expect(fieldNames).toContain('journal');
    expect(fieldNames).toContain('year');
    expect(fieldNames).toContain('link');
  });
});

describe('Team Member Schema', () => {
  it('has the correct name and title', () => {
    expect(teamMember.name).toBe('teamMember');
    expect(teamMember.title).toBe('Team Member');
  });

  it('contains all required fields', () => {
    const fieldNames = teamMember.fields.map(f => f.name);
    expect(fieldNames).toContain('name');
    expect(fieldNames).toContain('role');
    expect(fieldNames).toContain('bio');
    expect(fieldNames).toContain('headshot');
  });
});
