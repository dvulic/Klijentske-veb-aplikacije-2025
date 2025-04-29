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
export class TrailerService {
  static async getMovieTrailer(movieName: string, releaseYear: number){
    return client.request({
      url : '/trailer',
      method : "GET",
      params : {
        'movie' : movieName,
        'year' : releaseYear
      }
    })
  }

  static getEmbedLink(videoId: string){
    return `https://www.youtube.com/embed/${videoId}`
  }
}

//https://kva-api.onrender.com/trailer?movie=Inception&year=2010
