import { type SchemaTypeDefinition } from 'sanity';
import { researchProject } from './researchProject';
import { publication } from './publication';

export const schemaTypes: SchemaTypeDefinition[] = [researchProject, publication];
