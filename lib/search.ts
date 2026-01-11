interface ReferenceImage {
  title: string
  url: string
  thumbnailUrl: string
  source: string
}

interface SearchResult {
  images: ReferenceImage[]
  searchQuery: string
}

export async function searchAnimeReferences(
  skillLevel: string,
  weakestSkill: string
): Promise<SearchResult> {
  const skillToTopic: Record<string, string[]> = {
    lineQuality: ['anime line art tutorial', 'clean linework anime', 'anime sketching basics'],
    proportions: ['anime anatomy reference', 'anime body proportions', 'anime character poses'],
    shading: ['anime shading tutorial', 'cel shading anime', 'anime lighting reference'],
    composition: ['anime composition examples', 'dynamic anime poses', 'anime scene layout'],
    styleConsistency: ['anime art style guide', 'consistent anime character design', 'anime style study']
  }

  const levelModifier: Record<string, string> = {
    beginner: 'beginner tutorial simple',
    intermediate: 'intermediate practice study',
    advanced: 'advanced technique professional'
  }

  const topics = skillToTopic[weakestSkill] || skillToTopic.proportions
  const topic = topics[Math.floor(Math.random() * topics.length)]
  const modifier = levelModifier[skillLevel] || levelModifier.beginner

  const searchQuery = `${topic} ${modifier}`

  const mockImages: ReferenceImage[] = [
    {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Reference 1`,
      url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`,
      thumbnailUrl: '/placeholder-ref-1.jpg',
      source: 'Pinterest'
    },
    {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Reference 2`,
      url: `https://www.deviantart.com/search?q=${encodeURIComponent(searchQuery)}`,
      thumbnailUrl: '/placeholder-ref-2.jpg',
      source: 'DeviantArt'
    },
    {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Tutorial`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
      thumbnailUrl: '/placeholder-ref-3.jpg',
      source: 'YouTube'
    }
  ]

  return {
    images: mockImages,
    searchQuery
  }
}

export function getRecommendedSearchQueries(
  skillLevel: string,
  scores: {
    lineQuality: number
    proportions: number
    shading: number
    composition: number
    styleConsistency: number
  }
): string[] {
  const skills = [
    { name: 'Line Quality', score: scores.lineQuality, query: 'anime lineart tutorial' },
    { name: 'Proportions', score: scores.proportions, query: 'anime anatomy reference' },
    { name: 'Shading', score: scores.shading, query: 'anime shading techniques' },
    { name: 'Composition', score: scores.composition, query: 'anime composition guide' },
    { name: 'Style', score: scores.styleConsistency, query: 'anime art style study' }
  ]

  const sorted = skills.sort((a, b) => a.score - b.score)
  const weakest = sorted.slice(0, 3)

  const levelPrefix = skillLevel === 'beginner' ? 'beginner' : skillLevel === 'intermediate' ? 'intermediate' : 'advanced'

  return weakest.map(skill => `${levelPrefix} ${skill.query}`)
}
