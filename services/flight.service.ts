import axios from "axios";


export class FlightService {
  static async getFlights(){
    return axios.get("https://jsonplaceholder.typicode.com/todos/1")
  }
}