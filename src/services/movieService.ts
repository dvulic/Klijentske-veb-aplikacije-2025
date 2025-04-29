import axios from "axios";

const client = axios.create({
  baseURL: "https://movie.pequla.com/api",
  headers: {
    'Accept' : 'application/json',
    'X-Client-Name' : 'KVA/2025'
  },
  validateStatus: (status: number) => {
    return status === 200
  }
})

export class MovieService{
  static async getMovies(search = '', actorID = '', genreID = '', directorID = '', runtime = ''){
    return client.request({
      url : '/movie',
      method: "GET",
      params : {
        'search' : search,
        'actor' : actorID,
        'genre' : genreID,
        'director' : directorID,
        'runtime' : runtime
      }
    })
  }

  static async getMovieByShortUrl(shortUrl: string){
    return client.request({
      url : `/movie/short/${shortUrl}`,
      method: "GET",
    })
  }

  static async getGenres(){
    return client.request({
      url : '/genre',
      method: "GET",
      // params : {
      //
      // }
    })
  }

  static async getDirectors(){
    return client.request({
      url : '/director',
      method: "GET",
    })
  }

  static async getActors(){
    return client.request({
      url : '/actor',
      method: "GET",
    })
  }

}