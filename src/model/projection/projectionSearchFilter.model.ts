import {Duration} from "../../app/search/duration.enum";
import {ModelActor} from "../model.actor";
import {ModelDirector} from "../model.director";
import {ModelGenre} from "../model.genre";
import {GradeEnum} from "../../app/search/grade.enum";

export interface ProjectionSearchFilters {
  searchedTitle: string | null;
  selectedPrice: number | null;
  selectedDuration: Duration;
  selectedReleaseDate: string | null;
  selectedDate: string | null;
  selectedTime: string[] | null;
  selectedActors: ModelActor[];
  selectedDirector: ModelDirector | null;
  selectedGenres: ModelGenre[];
  selectedReview: GradeEnum | null;
}