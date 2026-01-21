import { defineConfig } from 'sanity';
import config from '../sanity.config';

describe('Sanity Configuration', () => {
  it('has the correct base path', () => {
    expect(config.basePath).toBe('/studio');
  });

  it('uses project ID and dataset from environment', () => {
    // These will be from .env.local during development
    expect(config.projectId).toBe(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    expect(config.dataset).toBe(process.env.NEXT_PUBLIC_SANITY_DATASET);
  });
});
