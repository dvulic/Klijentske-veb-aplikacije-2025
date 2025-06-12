import {Component} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {CartItemModel} from "../../model/cart/cartItem.model";
import {MatButton} from "@angular/material/button";
import {ModelUser} from "../../model/model.user";
import {UserService} from "../../services/user.service";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";
import {MatCard} from "@angular/material/card";
import {TicketstatusEnum} from "../../model/cart/ticketstatus.enum";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NgIf} from "@angular/common";
import { MatTooltip } from '@angular/material/tooltip';
import Swal from "sweetalert2";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-cart',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatButton,
    MatCard,
    MatStepper,
    MatStep,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatStepLabel,
    MatInput,
    MatStepperNext,
    MatStepperPrevious,
    MatRadioGroup,
    MatRadioButton,
    NgIf,
    MatTooltip,
    MatDivider,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  user: ModelUser | null = null
  orders: CartItemModel[] | null = null
  dataSource = new MatTableDataSource<CartItemModel>([]);
  displayedColumns: string[] = ['title', 'hall', 'date', 'time', 'price', 'numOfTickets', 'sumPrice', 'status', 'action'];
  //Stepper
  contactInfoFg: FormGroup
  paymentOptionFg: FormGroup
  cardInfoFg: FormGroup
  constructor(private router: Router, private fb: FormBuilder) {
    this.user = UserService.getActiveUser();

    this.contactInfoFg = fb.group({
      firstName: [this.user ? `${this.user.firstName} ${this.user.lastName}` : '', Validators.required],
      phoneNumber: [this.user ? this.user.phoneNumber : '', Validators.required],
      address: [this.user ? this.user.address : '', Validators.required]
    })
    this.paymentOptionFg = fb.group({
      paymentMethod: ['', Validators.required]
    })
    this.cardInfoFg = fb.group({
      cardholderName: ['', Validators.required],
      expirationDate: ['', Validators.required],
      ccv: ['', Validators.pattern('^\\d{3,4}$')],
      cardNumber: ['', Validators.pattern('^\\d{13,19}$')]
    })

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.orders = this.user.cartItems
    this.dataSource.data = this.orders
  }


  removeItem(cartItemId: number){
    let activeUser = UserService.getActiveUser()
    if(!UserService.getActiveUser()) return


    const res = CartService.removeFromCart(cartItemId)
    activeUser = UserService.getActiveUser()

    if (res && activeUser) {
      this.user = activeUser
      this.orders = this.user.cartItems
      this.dataSource.data = this.orders
    }

    if(!res){
      Swal.fire({
        title: 'Greška',
        text: 'Brisanje iz korpe nije uspelo.',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
    }
    // else {
    //   Swal.fire({
    //     title: 'Info',
    //     text: 'Brisanje iz korpe uspelo!',
    //     icon: 'success',
    //     timer: 3000,
    //     timerProgressBar: true
    //   });
    // }
  }

  cancelReservation(cartItemId: number){
    let activeUser = UserService.getActiveUser()
    if(!UserService.getActiveUser()) return


    const res = CartService.cancelReservation(cartItemId)
    activeUser = UserService.getActiveUser()

    if (res && activeUser) {
      this.user = activeUser
      this.orders = this.user.cartItems
      this.dataSource.data = this.orders
    }
    this.totalReservedPrice
    if(!res){
      Swal.fire({
        title: 'Greška',
        text: 'Otkazivanje rezervacije iz korpe nije uspelo.',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
    }
    // else {
    //   Swal.fire({
    //     title: 'Info',
    //     text: 'Otkazivanje rezervacije iz korpe uspelo!',
    //     icon: 'success',
    //     timer: 3000,
    //     timerProgressBar: true
    //   });
    // }
  }

  payReservation(cartItemId: number){
    let activeUser = UserService.getActiveUser()
    if(!UserService.getActiveUser()) return


    const res = CartService.payReservation(cartItemId)
    activeUser = UserService.getActiveUser()

    if (res && activeUser) {
      this.user = activeUser
      this.orders = this.user.cartItems
      this.dataSource.data = this.orders
    }

    return res
    //alert(res)
  }

  get totalReservedPrice(): number {
    return this.dataSource.data
    .filter(item => item.ticketStatus === TicketstatusEnum.reserved)
    .reduce((total, item) => total + item.ticketPriceSum, 0);
  }

  payAllReserved() {
    const payableReservations = this.dataSource.data
    .filter(item => item.ticketStatus === TicketstatusEnum.reserved)

    const res = true
    for(let reservation of payableReservations){
      this.payReservation(reservation.CartItemId)

      if(!res){
        Swal.fire({
          title: 'Greška',
          text: 'Plaćanje nije uspelo. Molimo pokušajte ponovo.',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true
        });
        return
      }
    }

      Swal.fire({
        title: 'Info',
        text: 'Vaša narudžbina je uspešno realizovana!',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true
      });
  }

}
