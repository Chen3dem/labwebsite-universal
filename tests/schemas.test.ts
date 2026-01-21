import { researchProject } from '../sanity/schemaTypes/researchProject';

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
