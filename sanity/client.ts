import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn } from '../sanity/env';

export const getClient = () => createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});
