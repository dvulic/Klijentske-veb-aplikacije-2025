import {TicketstatusEnum} from "./ticketstatus.enum";

export interface CartItemModel {
  CartItemId: number
  projectionId: number
  numberOfTickets: number
  movieId: number
  movieTitle: string
  hallId: number
  projectionDate: string
  projectionTime: string
  pricePerTicket: number
  ticketPriceSum: number
  userEmail: string
  ticketStatus: TicketstatusEnum
}