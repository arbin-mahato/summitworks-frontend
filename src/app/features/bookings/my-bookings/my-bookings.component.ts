import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Calendar, MapPin, CheckCircle, Clock, Trash2, ExternalLink } from 'lucide-angular';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="bookings-page">
      <div class="page-header">
        <h1>My Bookings</h1>
        <p>Manage and view your hotel reservations.</p>
      </div>

      <div class="bookings-tabs">
        <button 
          class="tab" 
          [class.active]="currentTab() === 'upcoming'"
          (click)="currentTab.set('upcoming')">My Bookings</button>
        <button 
          class="tab" 
          [class.active]="currentTab() === 'cancelled'"
          (click)="currentTab.set('cancelled')">Cancelled</button>
      </div>

      <div class="bookings-list" *ngIf="filteredBookings().length > 0">
        <div *ngFor="let booking of filteredBookings()" class="booking-card" [class.upcoming]="booking.status.toUpperCase() === 'CONFIRMED'">
          <div class="booking-image">
            <img [src]="'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400'" [alt]="booking.hotelName">
          </div>
          
          <div class="booking-details">
            <div class="details-main">
              <div class="header">
                <span class="booking-id">#{{ booking.bookingId }}</span>
                <span class="status-badge" [class]="booking.status.toLowerCase()">
                  <lucide-icon [name]="booking.status.toUpperCase() === 'CONFIRMED' ? 'check-circle' : (booking.status.toUpperCase() === 'CANCELLED' ? 'trash-2' : 'clock')" size="14"></lucide-icon>
                  {{ booking.status | titlecase }}
                </span>
              </div>
              <h2 class="hotel-name">{{ booking.hotelName }}</h2>
              <div class="location">
                <lucide-icon name="map-pin" size="14"></lucide-icon>
                {{ booking.city }}, {{ booking.state }}
              </div>
            </div>

            <div class="details-info">
              <div class="info-item">
                <label>Check-in</label>
                <span>{{ booking.checkInDate | date:'mediumDate' }}</span>
              </div>
              <div class="info-item">
                <label>Check-out</label>
                <span>{{ booking.checkOutDate | date:'mediumDate' }}</span>
              </div>
              <div class="info-item">
                <label>Room</label>
                <span>{{ booking.roomType }} ({{ booking.roomLabel }})</span>
              </div>
              <div class="info-item">
                <label>Total Price</label>
                <span class="price">\${{ booking.totalPrice | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="booking-actions" *ngIf="booking.status.toUpperCase() === 'CONFIRMED'">
              <button class="secondary-btn" routerLink="/app/hotels">
                <lucide-icon name="external-link" size="16"></lucide-icon>
                Book More
              </button>
              <button class="danger-btn" (click)="cancelBooking(booking.bookingId)">
                <lucide-icon name="trash-2" size="16"></lucide-icon>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredBookings().length === 0 && !isLoading()" class="empty-state">
        <lucide-icon name="calendar" size="64" class="empty-icon"></lucide-icon>
        <h2>No bookings found</h2>
        <p>You have no {{ currentTab() }} bookings at the moment.</p>
        <button routerLink="/app/hotels" class="explore-btn">Explore Hotels</button>
      </div>

      <div *ngIf="isLoading()" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    </div>
  `,
  styles: [`
    .bookings-page { display: flex; flex-direction: column; gap: 32px; }
    .page-header h1 { font-size: 36px; margin-bottom: 8px; font-family: 'Outfit', sans-serif; }
    .page-header p { color: #64748b; }
    .bookings-tabs { display: flex; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .tab { padding: 12px 24px; font-size: 14px; font-weight: 600; color: #64748b; border-radius: 8px; transition: all 0.2s; background: transparent; border: none; cursor: pointer; }
    .tab:hover { color: #2563eb; background: #eff6ff; }
    .tab.active { color: #2563eb; background: #dbeafe; }
    .bookings-list { display: flex; flex-direction: column; gap: 24px; }
    .booking-card { display: grid; grid-template-columns: 240px 1fr; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; transition: all 0.2s; }
    .booking-card:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); transform: translateY(-2px); }
    .booking-image img { width: 100%; height: 100%; object-fit: cover; }
    .booking-details { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .booking-id { font-family: monospace; font-size: 12px; color: #94a3b8; }
    .status-badge { display: flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
    .status-badge.confirmed { background: #ecfdf5; color: #059669; }
    .status-badge.pending { background: #fffbeb; color: #d97706; }
    .status-badge.cancelled { background: #fef2f2; color: #dc2626; }
    .hotel-name { font-size: 24px; font-family: 'Outfit', sans-serif; }
    .location { font-size: 14px; color: #64748b; display: flex; align-items: center; gap: 4px; }
    .details-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 16px; background: #f8fafc; border-radius: 12px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
    .info-item span { font-size: 14px; font-weight: 600; color: #1e293b; }
    .info-item .price { color: #2563eb; }
    .booking-actions { display: flex; gap: 16px; }
    .secondary-btn, .danger-btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; transition: all 0.2s; border: none; cursor: pointer; }
    .secondary-btn { background: #f1f5f9; color: #475569; }
    .secondary-btn:hover { background: #e2e8f0; }
    .danger-btn { background: #fef2f2; color: #dc2626; }
    .danger-btn:hover { background: #fee2e2; }
    .empty-state { text-align: center; padding: 64px; background: white; border-radius: 16px; border: 1px dashed #e2e8f0; }
    .empty-icon { color: #e2e8f0; margin-bottom: 24px; }
    .explore-btn { margin-top: 24px; padding: 12px 32px; background: #2563eb; color: white; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; }
    .loading-state { text-align: center; padding: 64px; }
    .spinner { width: 32px; height: 32px; border: 4px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .booking-card { grid-template-columns: 1fr; } .booking-image { height: 200px; } .details-info { grid-template-columns: 1fr 1fr; } }
  `]
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  
  bookings = signal<Booking[]>([]);
  currentTab = signal<'upcoming' | 'cancelled'>('upcoming');
  isLoading = signal<boolean>(true);

  filteredBookings = computed(() => {
    const data = this.bookings();
    const tab = this.currentTab();
    
    return data.filter(b => {
      const status = b.status.toUpperCase();
      if (tab === 'upcoming') return status === 'CONFIRMED' || status === 'PENDING';
      if (tab === 'cancelled') return status === 'CANCELLED';
      return true;
    });
  });

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingService.getUserBookings().subscribe({
      next: (response: any) => {
        // Handle direct array or { data: [] } wrapper
        const data = Array.isArray(response) ? response : (response.data || []);
        this.bookings.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load user bookings', err);
        this.isLoading.set(false);
      }
    });
  }

  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id.toString()).subscribe({
        next: () => {
          alert('Success! Your booking has been cancelled.');
          this.loadBookings();
        },
        error: (err) => {
          console.error('Cancellation failed', err);
          alert('Could not cancel booking. Please try again.');
        }
      });
    }
  }
}
