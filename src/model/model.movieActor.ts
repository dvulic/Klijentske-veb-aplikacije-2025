import {ModelActor} from "./model.actor";

export interface ModelMovieActor {
  movieActorId: number
  movieId: number
  actorId: number
  actor: ModelActor
}