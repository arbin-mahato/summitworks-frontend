import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Hotel, Room } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/hotels`;

  private sampleImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
  ];

  // 🔹 GET HOTELS
  getHotels(filters?: { state?: string, city?: string, startDate?: string, days?: number }) {

    let params: any = {};

    if (filters) {
      if (filters.state) params.state = filters.state;
      if (filters.city) params.city = filters.city;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.days) params.days = filters.days;
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => {
        const hotels = Array.isArray(res) ? res : (res.data || []);
        return hotels.map((h: any, i: number) => {
          const imageUrl = h.image || this.sampleImages[i % this.sampleImages.length];
          return {
            ...h,
            image: imageUrl,
            rating: h.rating || 4.5 + (Math.random() * 0.5)
          };
        });
      })
    );
  }

  // 🔹 GET STATES
  getStates() {
    return this.http.get<any>(`${this.apiUrl}/states`).pipe(
      map(res => {
        const data = Array.isArray(res) ? res : (res.data || []);
        return data.map((s: any) => typeof s === 'string' ? s : s.state);
      })
    );
  }

  // 🔹 GET CITIES
  getCities(state?: string) {
    let params: any = {};
    if (state) params.state = state;

    return this.http.get<any>(`${this.apiUrl}/cities`, { params }).pipe(
      map(res => {
        const data = Array.isArray(res) ? res : (res.data || []);
        return data.map((c: any) => typeof c === 'string' ? c : c.city);
      })
    );
  }

  // 🔹 GET HOTEL BY ID
  getHotelById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(h => ({
        ...h,
        image: h.image || this.sampleImages[0],
        rating: h.rating || 4.8
      }))
    );
  }

  // 🔹 SAVE HOTEL
  saveHotel(hotel: Partial<Hotel>) {
    if (hotel.hotelId) {
      return this.http.put(`${this.apiUrl}/${hotel.hotelId}`, hotel);
    }
    return this.http.post(this.apiUrl, hotel);
  }

  // 🔹 DELETE HOTEL
  deleteHotel(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 GET ROOMS
  getRooms(hotelId: number, checkIn?: string, checkOut?: string) {

    let params: any = {};
    if (checkIn) params.checkInDate = checkIn;
    if (checkOut) params.checkOutDate = checkOut;

    return this.http.get<any>(`${this.apiUrl}/${hotelId}/rooms`, { params }).pipe(
      map(res => {
        const rooms = Array.isArray(res) ? res : (res.data || []);
        return rooms.map((room: any, i: number) => ({
          ...room,
          image: room.image || this.sampleImages[i % this.sampleImages.length]
        }));
      })
    );
  }
}