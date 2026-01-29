import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
let builder: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => {
    if (!builder) {
        builder = createImageUrlBuilder({ projectId, dataset })
    }
    return builder.image(source)
}
