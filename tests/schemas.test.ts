import { researchProject } from '../sanity/schemaTypes/researchProject';
import { publication } from '../sanity/schemaTypes/publication';

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
