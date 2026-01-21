import { client } from '../sanity/client';
import { projectId, dataset } from '../sanity/env';

// Mock the environment variables to ensure assertValue doesn't throw during import
vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-project-id');
vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'test-dataset');

describe('Sanity Client', () => {
  it('is initialized with correct config', () => {
    expect(client.config().projectId).toBe(projectId);
    expect(client.config().dataset).toBe(dataset);
  });
});
