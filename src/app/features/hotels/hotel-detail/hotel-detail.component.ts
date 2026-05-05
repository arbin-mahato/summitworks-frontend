import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HotelService } from '../../../core/services/hotel.service';
import { BookingService } from '../../../core/services/booking.service';
import { Hotel, Room } from '../../../core/models';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  template: `
    <div class="detail-page" *ngIf="hotel()">
      <!-- Breadcrumb / Back Navigation -->
      <div class="top-nav">
        <div class="container">
          <a routerLink="/app/hotels" class="back-link">
            <lucide-icon name="arrow-left" size="16"></lucide-icon>
            Back to Listings
          </a>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="hero-header" [style.background-image]="'url(' + hotel()?.image + ')'">
        <div class="hero-overlay">
          <div class="container">
            <h1 class="hotel-title">{{ hotel()?.hotelName }}</h1>
            <div class="hotel-meta">
              <span><lucide-icon name="map-pin" size="18"></lucide-icon> {{ hotel()?.city }}, {{ hotel()?.state }}</span>
              <span><lucide-icon name="star" size="18" class="star-icon"></lucide-icon> {{ hotel()?.rating | number:'1.1-1' }} Rating</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Date Bar -->
      <div class="date-bar">
        <div class="container flex-bar">
          <div class="date-group">
            <div class="date-input">
              <label>Check-in</label>
              <input type="date" [(ngModel)]="checkIn" (change)="onDateChange()">
            </div>
            <div class="date-divider"></div>
            <div class="date-input">
              <label>Check-out</label>
              <input type="date" [(ngModel)]="checkOut" (change)="onDateChange()">
            </div>
          </div>
          <div class="nights-badge" *ngIf="nights() > 0">
            {{ nights() }} {{ nights() === 1 ? 'Night' : 'Nights' }} stay
          </div>
        </div>
      </div>

      <div class="container main-content">
        <div class="content-grid">
          <div class="rooms-section">
            <div class="section-header">
              <h2>Select Your Room</h2>
              <p>Choose from our available luxury spaces</p>
            </div>

            <!-- Loading State -->
            <div class="loading-state" *ngIf="isLoading()">
              <div class="spinner"></div>
              <p>Checking live availability...</p>
            </div>

            <!-- Room List -->
            <div class="rooms-list" *ngIf="!isLoading()">
              <div *ngFor="let room of rooms()" class="room-card" [class.unavailable]="!room.available">
                <div class="room-image">
                  <img [src]="room.image" [alt]="room.roomType">
                  <div class="status-badge" [class.booked]="!room.available">
                    {{ room.available ? 'Available' : 'Already Booked' }}
                  </div>
                </div>
                <div class="room-info">
                  <div class="room-header">
                    <div>
                      <span class="room-label">{{ room.roomLabel }}</span>
                      <h3 class="room-type">{{ room.roomType }}</h3>
                    </div>
                    <div class="room-price">
                      <span class="currency">$</span>
                      <span class="amount">{{ room.price }}</span>
                      <span class="period">/night</span>
                    </div>
                  </div>

                  <div class="room-features">
                    <div class="feature-chip" *ngFor="let feature of room.features">
                      <lucide-icon [name]="getFeatureIcon(feature)" size="14"></lucide-icon>
                      {{ feature }}
                    </div>
                  </div>

                  <div class="room-footer">
                    <div class="total-price" *ngIf="nights() > 0">
                      Total for {{ nights() }} nights: <strong>\${{ (room.price * nights()) | number:'1.2-2' }}</strong>
                    </div>
                    <button 
                      class="book-btn" 
                      [disabled]="!room.available || nights() <= 0"
                      (click)="bookRoom(room)">
                      {{ room.available ? 'Book Now' : 'Unavailable' }}
                      <lucide-icon name="arrow-right" size="16" *ngIf="room.available"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Info -->
          <aside class="sidebar">
            <div class="info-card">
              <h3>Property Info</h3>
              <p class="description">{{ hotel()?.description }}</p>
              <div class="amenities-grid">
                <div class="amenity"><lucide-icon name="wifi" size="18"></lucide-icon> High-speed WiFi</div>
                <div class="amenity"><lucide-icon name="coffee" size="18"></lucide-icon> Fresh Breakfast</div>
                <div class="amenity"><lucide-icon name="waves" size="18"></lucide-icon> Swimming Pool</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    
    .top-nav {
      background: #f8fafc;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #475569;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .back-link:hover { 
      color: #2563eb; 
      border-color: #2563eb;
      background: #f0f7ff;
      transform: translateX(-4px);
    }

    .hero-header {
      height: 400px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
      display: flex;
      align-items: flex-end;
      padding-bottom: 48px;
      color: white;
    }

    .hotel-title { 
      font-size: 48px; 
      margin-bottom: 8px; 
      font-family: 'Outfit', sans-serif; 
      color: white;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5); 
    }
    
    .hotel-meta { 
      display: flex; 
      gap: 32px; 
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600; 
      text-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
    .hotel-meta span { display: flex; align-items: center; gap: 8px; }
    .star-icon { color: #fbbf24; fill: #fbbf24; }

    .date-bar {
      background: white;
      border-bottom: 1px solid #f3f4f6;
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .flex-bar { display: flex; align-items: center; justify-content: space-between; }

    .date-group {
      display: flex;
      align-items: center;
      background: #f9fafb;
      border-radius: 12px;
      padding: 4px;
      border: 1px solid #f3f4f6;
    }

    .date-input { padding: 8px 24px; display: flex; flex-direction: column; }
    .date-input label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #9ca3af; margin-bottom: 2px; }
    .date-input input { border: none; background: transparent; font-weight: 600; font-family: inherit; font-size: 14px; outline: none; }

    .date-divider { width: 1px; height: 30px; background: #e5e7eb; }

    .nights-badge {
      background: #eff6ff;
      color: #2563eb;
      padding: 8px 16px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 14px;
    }

    .main-content { margin-top: 48px; margin-bottom: 80px; }
    
    .content-grid { display: grid; grid-template-columns: 1fr 350px; gap: 48px; }

    .section-header { margin-bottom: 32px; }
    .section-header h2 { font-size: 32px; font-family: 'Outfit', sans-serif; margin-bottom: 4px; }
    .section-header p { color: #6b7280; }

    .rooms-list { display: flex; flex-direction: column; gap: 32px; }

    .room-card {
      display: grid;
      grid-template-columns: 280px 1fr;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #f3f4f6;
    }

    .room-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }

    .room-card.unavailable { opacity: 0.6; filter: grayscale(0.5); }

    .room-image { position: relative; height: 100%; }
    .room-image img { width: 100%; height: 100%; object-fit: cover; }

    .status-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      background: rgba(255,255,255,0.9);
      color: #059669;
      backdrop-filter: blur(4px);
    }

    .status-badge.booked { color: #dc2626; }

    .room-info { padding: 32px; display: flex; flex-direction: column; gap: 24px; }

    .room-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .room-label { font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; }
    .room-type { font-size: 24px; font-family: 'Outfit', sans-serif; margin-top: 4px; }

    .room-price { text-align: right; }
    .room-price .currency { font-size: 14px; font-weight: 700; color: #9ca3af; vertical-align: top; margin-top: 4px; display: inline-block; }
    .room-price .amount { font-size: 24px; font-weight: 800; color: #111827; }
    .room-price .period { font-size: 12px; color: #9ca3af; }

    .room-features { display: flex; flex-wrap: wrap; gap: 8px; }
    .feature-chip {
      background: #f9fafb;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #4b5563;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .room-footer {
      margin-top: auto;
      padding-top: 24px;
      border-top: 1px solid #f3f4f6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-price { font-size: 14px; color: #6b7280; }
    .total-price strong { color: #111827; font-size: 18px; margin-left: 4px; }

    .book-btn {
      padding: 12px 28px;
      background: linear-gradient(135deg, #2563eb, #1e40af);
      color: white;
      border-radius: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .book-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .book-btn:disabled { background: #e5e7eb; cursor: not-allowed; }

    .info-card { background: #f9fafb; padding: 32px; border-radius: 16px; border: 1px solid #f3f4f6; }
    .info-card h3 { font-family: 'Outfit', sans-serif; font-size: 20px; margin-bottom: 16px; }
    .description { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 32px; }

    .amenities-grid { display: flex; flex-direction: column; gap: 16px; }
    .amenity { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; color: #374151; }

    .loading-state { padding: 80px; text-align: center; color: #9ca3af; }
    .spinner { width: 40px; height: 40px; border: 3px solid #f3f4f6; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 992px) {
      .content-grid { grid-template-columns: 1fr; }
      .room-card { grid-template-columns: 1fr; }
      .room-image { height: 200px; }
    }
  `]
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);

  hotel = signal<Hotel | undefined>(undefined);
  rooms = signal<Room[]>([]);
  isLoading = signal(false);

  checkIn: string = '';
  checkOut: string = '';

  nights = computed(() => {
    if (!this.checkIn || !this.checkOut) return 0;
    const start = new Date(this.checkIn);
    const end = new Date(this.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.checkIn = today.toISOString().split('T')[0];
    this.checkOut = tomorrow.toISOString().split('T')[0];

    this.hotelService.getHotels().subscribe((hotels: Hotel[]) => {
      const hotel = hotels.find((h: Hotel) => h.hotelId === id);

      if (hotel) {
        this.hotel.set(hotel);
        this.loadRooms();
      } else {
        console.error("Hotel not found");
      }
    });
  }
  onDateChange() {
    if (this.checkIn && this.checkOut) {
      this.loadRooms();
    }
  }

  loadRooms() {
    if (!this.hotel()) return;

    this.isLoading.set(true);
    this.hotelService.getRooms(this.hotel()!.hotelId, this.checkIn, this.checkOut)
      .subscribe({
        next: (rooms) => {
          this.rooms.set(rooms);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }

  getFeatureIcon(feature: string): string {
    const feat = feature.toLowerCase();
    if (feat.includes('wifi')) return 'wifi';
    if (feat.includes('tv')) return 'tv';
    if (feat.includes('bar')) return 'coffee';
    if (feat.includes('desk')) return 'layout';
    if (feat.includes('coffee')) return 'coffee';
    return 'check-circle';
  }

  bookRoom(room: Room) {
    if (!this.hotel() || this.nights() <= 0) return;

    const bookingPayload = {
      hotelId: this.hotel()!.hotelId,
      roomId: room.roomId,
      checkInDate: this.checkIn,
      checkOutDate: this.checkOut
    };

    this.bookingService.createBooking(bookingPayload).subscribe({
      next: (response) => {
        this.bookingService.lastBooking.set(response);
        this.router.navigate(['/app/hotels/confirmation']);
      },
      error: (err) => {
        console.error('Booking failed', err);
        // Fallback for demo
        const mockResponse = {
          bookingId: Math.floor(Math.random() * 1000),
          message: "Success",
          hotelName: this.hotel()?.hotelName,
          roomLabel: room.roomLabel,
          checkInDate: this.checkIn,
          checkOutDate: this.checkOut,
          totalPrice: room.price * this.nights(),
          status: "CONFIRMED",
          bookingDate: new Date().toISOString()
        };
        this.bookingService.lastBooking.set(mockResponse);
        this.router.navigate(['/app/hotels/confirmation']);
      }
    });
  }
}
