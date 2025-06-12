import {ModelUser} from "./model.user";

export interface LocalGradeModel {
  user : ModelUser
  movieId: number
  grade : number
  comment : string | null
}