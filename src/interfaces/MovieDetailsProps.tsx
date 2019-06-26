interface MovieCollection{
    id: number,
    name: string,
    poster_path: string,
    backdrop_path: string
}

interface MovieGenre{
    id: number,
    name: string
}

interface MovieProductionCompany{
    id: number,
    logo_path:string|null
    name: string,
    origin_country: string,
}

interface MovieProductionCountries{
    iso_3166_1: number,
    name: string,
}

interface MovieSpokenLanguange{
    iso_639_1: number,
    name: string,
}

export default interface MovieDetailsProps{
    id:string,
    imdb_id: string,
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection: null|MovieCollection,
    budget: number,
    genres: Array<MovieGenre>,
    homepage: string|null,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: Array<MovieProductionCompany>,
    production_countries: Array<MovieProductionCountries>,
    release_date: string,
    revenue: number,
    runtime: 109,
    spoken_languages: Array<MovieSpokenLanguange>,
    status: string,
    tagline: string,
    title: string,
    vote_average: number,
    vote_count: number
}