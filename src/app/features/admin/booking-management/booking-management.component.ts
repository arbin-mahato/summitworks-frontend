import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Filter, CheckCircle, XCircle, Clock, MoreHorizontal } from 'lucide-angular';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Booking Management</h1>
          <p>View and manage all reservations across the platform.</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="label">Total Bookings</span>
            <span class="value">{{ bookings.length }}</span>
          </div>
          <div class="stat-card">
            <span class="label">Revenue</span>
            <span class="value">\${{ totalRevenue() | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>

      <div class="table-controls">
        <div class="search-box">
          <lucide-icon name="search" size="18"></lucide-icon>
          <input type="text" placeholder="Search by booking ID or hotel..." (input)="onSearch($event)">
        </div>
        <div class="filters">
          <button class="filter-btn" [class.active]="statusFilter === 'ALL'" (click)="onFilterChange('ALL')">All</button>
          <button class="filter-btn" [class.active]="statusFilter === 'CONFIRMED'" (click)="onFilterChange('CONFIRMED')">Confirmed</button>
          <button class="filter-btn" [class.active]="statusFilter === 'PENDING'" (click)="onFilterChange('PENDING')">Pending</button>
          <button class="filter-btn" [class.active]="statusFilter === 'CANCELLED'" (click)="onFilterChange('CANCELLED')">Cancelled</button>
        </div>
      </div>

      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Hotel & Room</th>
              <th>Location</th>
              <th>Stay Dates</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let booking of filteredBookings">
              <td><span class="booking-id">#{{ booking.bookingId }}</span></td>
              <td>
                <div class="hotel-info">
                  <span class="name">{{ booking.hotelName }}</span>
                  <span class="sub">{{ booking.roomType }} ({{ booking.roomLabel }})</span>
                </div>
              </td>
              <td>
                <span class="sub">{{ booking.city }}, {{ booking.state }}</span>
              </td>
              <td>
                <div class="date-info">
                  <span>{{ booking.checkInDate }} - {{ booking.checkOutDate }}</span>
                  <span class="sub">{{ calculateNights(booking) }} nights</span>
                </div>
              </td>
              <td><span class="price-value">\${{ booking.totalPrice }}</span></td>
              <td>
                <span class="status-badge" [class]="booking.status.toLowerCase()">
                  {{ booking.status | titlecase }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="icon-btn success" *ngIf="booking.status === 'PENDING'" (click)="confirmBooking(booking.bookingId)" title="Confirm">
                    <lucide-icon name="check-circle" size="18"></lucide-icon>
                  </button>
                  <button class="icon-btn danger" *ngIf="booking.status !== 'CANCELLED'" (click)="cancelBooking(booking.bookingId)" title="Cancel">
                    <lucide-icon name="x-circle" size="18"></lucide-icon>
                  </button>
                  <button class="icon-btn" title="More">
                    <lucide-icon name="more-horizontal" size="18"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .page-header h1 { font-size: 28px; margin-bottom: 4px; font-family: 'Outfit', sans-serif; }
    .page-header p { color: #64748b; }

    .header-stats { display: flex; gap: 24px; }
    .stat-card { background: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; flex-direction: column; min-width: 140px; border: 1px solid #e2e8f0; }
    .stat-card .label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
    .stat-card .value { font-size: 24px; font-weight: 700; color: #2563eb; }

    .table-controls { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .search-box { flex: 1; max-width: 400px; position: relative; display: flex; align-items: center; }
    .search-box lucide-icon { position: absolute; left: 16px; color: #94a3b8; }
    .search-box input { width: 100%; height: 44px; padding: 0 16px 0 48px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; }

    .filters { display: flex; gap: 8px; }
    .filter-btn { padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; color: #64748b; transition: all 0.2s; background: white; border: 1px solid #e2e8f0; cursor: pointer; }
    .filter-btn.active { background: #2563eb; color: white; border-color: #2563eb; }

    .table-container { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e2e8f0; }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { padding: 16px 24px; background: #f8fafc; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    .admin-table td { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }

    .booking-id { font-family: monospace; font-size: 14px; color: #94a3b8; }
    .name { display: block; font-weight: 700; color: #1e293b; font-size: 14px; }
    .sub { display: block; font-size: 11px; color: #64748b; }
    .price-value { font-weight: 700; color: #2563eb; }

    .status-badge { display: inline-flex; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
    .status-badge.confirmed { background: #ecfdf5; color: #059669; }
    .status-badge.pending { background: #fffbeb; color: #d97706; }
    .status-badge.cancelled { background: #fef2f2; color: #dc2626; }

    .action-buttons { display: flex; gap: 8px; }
    .icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: #94a3b8; transition: all 0.2s; background: #f8fafc; border: 1px solid #e2e8f0; cursor: pointer; }
    .icon-btn:hover { background: #f1f5f9; color: #1e293b; }
    .icon-btn.success:hover { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
    .icon-btn.danger:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  `]
})
export class BookingManagementComponent implements OnInit {
  private bookingService = inject(BookingService);
  
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  searchQuery = '';
  statusFilter = 'ALL';

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = 
        booking.bookingId.toString().includes(this.searchQuery) ||
        booking.hotelName.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'ALL' || booking.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onFilterChange(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  totalRevenue() {
    return this.bookings
      .filter((b: Booking) => b.status === 'CONFIRMED')
      .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0);
  }

  calculateNights(booking: Booking) {
    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  confirmBooking(id: number) {
    this.bookingService.confirmBooking(id.toString()).subscribe(() => {
      this.loadBookings();
    });
  }

  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id.toString()).subscribe(() => {
        this.loadBookings();
      });
    }
  }
}
