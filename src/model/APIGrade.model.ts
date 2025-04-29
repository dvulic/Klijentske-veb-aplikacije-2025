import {GradeModel} from "./grade.model";

export interface APIGradeModel {
  imdbID: string
  imdbRating : string
  imdbVotes : string
  otherRatings: GradeModel[]
}