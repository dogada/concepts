import { Id, Slug } from '~/types'

type ParsedSlug = { id: Id; slug: Slug }

export function parseSlug(slug: Slug): ParsedSlug {
  const tokens = slug.split('-')
  return { id: tokens[tokens.length - 1], slug }
}
