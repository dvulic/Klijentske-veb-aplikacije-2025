//Main use is to retrieve grades/votes for requested movie and display them,
import axios from "axios";

const client = axios.create({
  baseURL: "https://kva-api.onrender.com",
  headers: {
    'Accept' : 'application/json',
    'X-Client-Name' : 'KVA/2025'
  },
  validateStatus: (status: number) => {
    return status === 200
  }
})

export class OmdbService {
  static async getMovieGrades(movieName: string, releaseYear: number){
    return client.request({
      url : '/grade',
      method : "GET",
      params : {
        'movie' : encodeURIComponent(movieName),
        'year' : releaseYear
      }
    })
  }
}