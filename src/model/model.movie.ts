// movieId	1
// internalId	"HO00014952"
// corporateId	"A000016169"
// directorId	1
// title	"Bratstvo lopova 2: Panter"
// originalTitle	"Den of Thieves: Pantera"
// description	"U ovom nastavku, legendarni Big Nik (Butler) ponovo kreće u lov – ovog puta u opasni svet evropskog podzemlja. Njegova meta?…smrtonosnu operaciju. Spremite se za akciju bez prestanka – akciju u kojoj se svaki potez računa, a ulog je život ili smrt!"
// shortDescription	"Džerard Batler (Plane, 300) i O’Šea Džekson Jr. (Godzilla: King of the Monsters) vraćaju se u eksplozivnom nastavku akcionog hita iz 2018 „Bratstvo lopova“!"
// poster	"https://s3proxygw.cineplexx.at/cms-live/asset/_default_upload_bucket/B1_DEN-OF-THIEVES_2_SRB_712px446_1.jpg"
// startDate	"2025-01-09"
// shortUrl	"bratstvo-lopova-2-panter"
// runTime	130
// active	true
// createdAt	"2025-03-03T21:49:26.000Z"
// updatedAt	null
// director	{…}
// movieActors	(6)[…]
// movieGenres	(3)[…]

import {ModelMovieGenre} from "./model.movieGenre";
import {ModelDirector} from "./model.director";
import {ModelMovieActor} from "./model.movieActor";

export interface ModelMovie {
  id: number
  internalId: string
  corporateId: string
  directorId: number
  title: string
  originalTitle: string
  description: string
  shortDescription: string
  poster: string
  startDate: string
  shortUrl: string
  runTime: number
  active: boolean
  createdAt: string
  updatedAt: null | string
  director: ModelDirector
  movieActors: ModelMovieActor[]
  movieGenres: ModelMovieGenre[]
}