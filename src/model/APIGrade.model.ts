import {OmdbGradeModel} from "./omdbGrade.model";

export interface APIGradeModel {
  imdbID: string
  imdbRating : string
  imdbVotes : string
  otherRatings: OmdbGradeModel[]
}