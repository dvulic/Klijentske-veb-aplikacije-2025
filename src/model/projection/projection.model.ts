import {ModelMovie} from "../model.movie";

export interface ProjectionModel{
  id : number
  date: string
  time: string
  availableSeats: number
  price: number
  Movie: ModelMovie
  hallId: number
  //status
}