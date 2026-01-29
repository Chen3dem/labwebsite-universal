import { defineQuery } from "next-sanity";

export const ALL_PROJECTS_QUERY = defineQuery(`*[_type == "researchProject"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  mainImage,
  imageFit,
  startDate,
  endDate
}`);

export const ALL_MEMBERS_QUERY = defineQuery(`*[_type == "teamMember"] | order(order asc, name asc) {
  _id,
  name,
  role,
  bio,
  headshot,
  imageFit,
  email
}`);

export const ALL_PUBLICATIONS_QUERY = defineQuery(`*[_type == "publication"] | order(publishedAt desc) {
  _id,
  title,
  authors,
  journal,
  image,
  imageFit,
  publishedAt,
  url,
  file,
  doi
}`);

export const LATEST_NEWS_QUERY = defineQuery(`*[_type == "newsPost"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage,
  imageFit,
  url
}`);

export const ALL_NEWS_QUERY = defineQuery(`*[_type == "newsPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage,
  imageFit,
  url
}`);

export const FEATURED_PROJECTS_QUERY = defineQuery(`*[_type == "researchProject" && featured == true] | order(startDate desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  summary,
  mainImage,
  imageFit
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0] {
  heroImage,
  heroImages,
  heroImageFit,
  heroTitle
}`);

export const GALLERY_IMAGES_QUERY = defineQuery(`*[_type == "gallery"] | order(publishedAt desc) {
  _id,
  title,
  image,
  imageFit,
  caption,
  url
}`);



export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0] {
  labName,
  logo,
  institutionLogo,
  description,
  footerAddress,
  contactEmail,
  managerEmail,
  socialKey,
  quickLinks,
  researchIntro,
  joinUs,
}`);
