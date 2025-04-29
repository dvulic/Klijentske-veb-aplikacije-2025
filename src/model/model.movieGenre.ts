import {ModelGenre} from "./model.genre";

export interface ModelMovieGenre {
  movieGenreId: number,
  movieId: number,
  genreId: number
  genre: ModelGenre
}