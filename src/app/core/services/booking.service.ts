import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../models';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/api/v1/bookings`;
  
  lastBooking = signal<any>(null);

  getUserBookings() {
    return this.http.get<Booking[]>(`${environment.apiUrl}/api/v1/users/me/bookings`);
  }

  // Admin: Get all bookings across the platform
  getAllBookings() {
    return this.http.get<Booking[]>(`${environment.apiUrl}/api/v1/admin/bookings`);
  }

  createBooking(bookingData: { hotelId: number; roomId: number; checkInDate: string; checkOutDate: string }) {
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }

  confirmBooking(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/confirm`, {});
  }

  cancelBooking(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
