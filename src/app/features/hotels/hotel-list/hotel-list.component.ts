import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../core/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  template: `
    <div class="hotels-page">
      <div class="hero-header">
        <h1>Find Your Perfect Stay</h1>
        <p>Explore luxury hotels and cozy retreats at the best prices.</p>
      </div>

      <div class="filter-bar">
        <div class="filter-container">
          <!-- STATE DROPDOWN -->
          <div class="filter-item">
            <label><lucide-icon name="map-pin" size="14"></lucide-icon> State</label>
            <select [(ngModel)]="searchState">
              <option value="">All States</option>
              <option *ngFor="let state of states()" [value]="state">
                {{ state }}
              </option>
            </select>
          </div>

          <!-- CITY DROPDOWN / INPUT -->
          <div class="filter-item">
            <label><lucide-icon name="map-pin" size="14"></lucide-icon> City</label>
            <select [(ngModel)]="searchCity" *ngIf="cities().length > 0">
              <option value="">All Cities</option>
              <option *ngFor="let city of cities()" [value]="city">
                {{ city }}
              </option>
            </select>
            <input *ngIf="cities().length === 0" type="text" [(ngModel)]="searchCity" placeholder="e.g. San Diego">
          </div>

          <!-- DATE -->
          <div class="filter-item">
            <label><lucide-icon name="calendar" size="14"></lucide-icon> Check-in</label>
            <input type="date" [(ngModel)]="searchDate">
          </div>

          <!-- DAYS -->
          <div class="filter-item">
            <label><lucide-icon name="sliders-horizontal" size="14"></lucide-icon> Days ({{ searchDays }})</label>
            <input type="range" min="1" max="14" [(ngModel)]="searchDays">
          </div>

          <button class="search-btn" (click)="search()">
            <lucide-icon name="search" size="18"></lucide-icon>
            Search
          </button>
        </div>
      </div>

      <div class="hotels-grid" *ngIf="!isLoading()">
        <div *ngFor="let hotel of hotels()" class="hotel-card" [routerLink]="['/app/hotels', hotel.hotelId]">
          <div class="hotel-image">
            <img [src]="hotel.image" [alt]="hotel.hotelName">
            <div class="rating-badge" *ngIf="hotel.rating">
              <lucide-icon name="star" size="12" class="star-icon"></lucide-icon>
              {{ hotel.rating | number:'1.1-1' }}
            </div>
            <div class="availability-badge" [class.low]="hotel.availableRooms < 3">
              {{ hotel.availableRooms }} rooms left
            </div>
          </div>
          
          <div class="hotel-info">
            <div class="info-header">
              <h2 class="hotel-name">{{ hotel.hotelName }}</h2>
              <div class="location">
                <lucide-icon name="map-pin" size="14"></lucide-icon>
                {{ hotel.city }}, {{ hotel.state }}
              </div>
            </div>

            <p class="description">{{ hotel.description }}</p>

            <div class="availability-chips">
              <div *ngFor="let day of hotel.calendar" 
                   class="date-chip" 
                   [class.status-red]="day.availableRooms === 0"
                   [class.status-yellow]="day.availableRooms > 0 && day.availableRooms < 3"
                   [class.status-green]="day.availableRooms >= 3">
                <span class="chip-date">{{ day.date | date:'MMM dd' }}</span>
                <span class="chip-status">{{ day.availableRooms }} left</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-tag">
                <span class="label">Starting from</span>
                <div class="price-value">
                  <span class="currency">$</span>
                  <span class="amount">{{ hotel.startingPrice }}</span>
                  <span class="period">/night</span>
                </div>
              </div>
              <button class="book-btn">
                Book Now
                <lucide-icon name="arrow-right" size="16"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading()" class="loading-state">
        <div class="spinner"></div>
        <p>Searching for best hotels...</p>
      </div>

      <div *ngIf="!isLoading() && hotels().length === 0" class="empty-state">
        <h2>No hotels found</h2>
        <p>Try adjusting your filters to find more options.</p>
      </div>
    </div>
  `,
  styles: [`
    .hotels-page { padding: var(--space-8); max-width: 1400px; margin: 0 auto; }
    .hero-header { margin-bottom: var(--space-10); text-align: center; }
    .hero-header h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: var(--space-2); color: var(--color-gray-900); }
    .hero-header p { color: var(--color-gray-500); font-size: var(--text-lg); }
    
    .filter-bar { background: var(--color-white); padding: var(--space-6); border-radius: var(--radius-xl); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); margin-bottom: var(--space-8); border: 1px solid var(--color-gray-100); }
    .filter-container { display: flex; align-items: flex-end; gap: var(--space-6); flex-wrap: wrap; }
    .filter-item { display: flex; flex-direction: column; gap: var(--space-2); flex: 1; min-width: 150px; }
    .filter-item label { font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--color-gray-500); text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
    select, input[type="date"], input[type="text"] { height: 44px; padding: 0 var(--space-4); border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); background: var(--color-gray-50); font-size: var(--text-sm); transition: all 0.2s; outline: none; }
    select:focus, input:focus { border-color: var(--color-primary-500); background: white; }
    input[type="range"] { height: 44px; }
    
    .search-btn { height: 44px; padding: 0 var(--space-8); background: var(--gradient-primary); color: white; border-radius: var(--radius-lg); font-weight: var(--font-bold); display: flex; align-items: center; justify-content: center; gap: var(--space-2); transition: all 0.2s; border: none; cursor: pointer; }
    .search-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    
    .hotels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: var(--space-8); }
    .hotel-card { background: white; border-radius: var(--radius-xl); overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); transition: all 0.3s ease; border: 1px solid var(--color-gray-100); display: flex; flex-direction: column; cursor: pointer; text-decoration: none; color: inherit; }
    .hotel-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1); }
    
    .hotel-image { height: 240px; position: relative; overflow: hidden; }
    .hotel-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .hotel-card:hover .hotel-image img { transform: scale(1.1); }
    
    .rating-badge { position: absolute; top: 16px; right: 16px; background: rgba(255, 255, 255, 0.95); padding: 6px 12px; border-radius: var(--radius-full); font-weight: var(--font-bold); display: flex; align-items: center; gap: 6px; color: #1e293b; }
    .star-icon { color: #f59e0b; fill: #f59e0b; }
    
    .availability-badge { position: absolute; bottom: 16px; left: 16px; background: #10b981; color: white; padding: 4px 12px; border-radius: var(--radius-base); font-size: 10px; font-weight: 700; }
    .availability-badge.low { background: #ef4444; }
    
    .hotel-info { padding: var(--space-6); flex: 1; display: flex; flex-direction: column; gap: var(--space-4); }
    .hotel-name { font-size: 20px; font-weight: 700; color: #1e293b; font-family: 'Outfit', sans-serif; margin-bottom: 4px; }
    .location { font-size: 14px; color: #64748b; display: flex; align-items: center; gap: 6px; }
    .description { font-size: 14px; color: #475569; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    
    .availability-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
    .date-chip { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 8px; min-width: 80px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
    .date-chip.status-red { background: #fef2f2; border-color: #fecaca; }
    .date-chip.status-red .chip-date { color: #991b1b; }
    .date-chip.status-red .chip-status { color: #b91c1c; }
    .date-chip.status-yellow { background: #fffbeb; border-color: #fef3c7; }
    .date-chip.status-yellow .chip-date { color: #92400e; }
    .date-chip.status-yellow .chip-status { color: #b45309; }
    .date-chip.status-green { background: #f0fdf4; border-color: #dcfce7; }
    .date-chip.status-green .chip-date { color: #166534; }
    .date-chip.status-green .chip-status { color: #15803d; }
    
    .chip-date { font-size: 10px; font-weight: 700; color: #1e293b; text-transform: uppercase; }
    .chip-status { font-size: 9px; color: #64748b; }
    
    .card-footer { margin-top: auto; padding-top: var(--space-4); border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-end; }
    .price-tag .label { font-size: 12px; color: #64748b; display: block; margin-bottom: 2px; }
    .price-value { display: flex; align-items: baseline; gap: 2px; }
    .currency { font-size: 14px; font-weight: 700; color: #2563eb; }
    .amount { font-size: 24px; font-weight: 700; color: #1e293b; }
    .period { font-size: 12px; color: #64748b; }
    
    .book-btn { background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; transition: all 0.2s; }
    .book-btn:hover { background: #1d4ed8; transform: translateX(4px); }
    
    .loading-state, .empty-state { text-align: center; padding: 64px; }
    .spinner { width: 32px; height: 32px; border: 4px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);
  
  hotels = signal<Hotel[]>([]);
  isLoading = signal<boolean>(true);

  // Dropdown data
  states = signal<string[]>([]);
  cities = signal<string[]>([]);

  // Filters
  searchState: string = '';
  searchCity: string = '';
  searchDate: string = new Date().toISOString().split('T')[0];
  searchDays: number = 7;

  ngOnInit() {
    this.loadStates();
    this.loadCities();
    this.loadHotels();
  }

  loadStates() {
    this.hotelService.getStates().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res.data || []);
        this.states.set(data);
      },
      error: (err) => console.error('Error fetching states', err)
    });
  }

  loadCities() {
    this.hotelService.getCities().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res.data || []);
        this.cities.set(data);
      },
      error: (err) => console.error('Error fetching cities', err)
    });
  }

  loadHotels() {
    this.isLoading.set(true);
    this.hotelService.getHotels({
      state: this.searchState,
      city: this.searchCity,
      startDate: this.searchDate,
      days: this.searchDays
    }).subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.hotels.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hotels.set([]);
        this.isLoading.set(false);
      }
    });
  }

  search() {
    this.loadHotels();
  }
}
