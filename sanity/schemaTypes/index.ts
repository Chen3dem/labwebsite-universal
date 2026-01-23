import { type SchemaTypeDefinition } from 'sanity';
import { researchProject } from './researchProject';
import { publication } from './publication';
import { teamMember } from './teamMember';
import { newsPost } from './newsPost';
import gallery from './gallery';
import { homePage } from './homePage';

export const schemaTypes: SchemaTypeDefinition[] = [
  researchProject,
  publication,
  teamMember,
  newsPost,
  gallery,
  homePage,
];
