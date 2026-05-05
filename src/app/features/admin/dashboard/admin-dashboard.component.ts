import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-angular';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="report-page">
      <div class="report-header">
        <div class="title-section">
          <h1>Bookings Report</h1>
          <p>Comprehensive overview of all platform reservations.</p>
        </div>
        <div class="action-section">
          <button class="btn-secondary" (click)="exportCSV()">
            <lucide-icon name="download" size="18"></lucide-icon>
            Export CSV
          </button>
        </div>
      </div>

      <div class="report-card">
        <div class="table-container">
          <table class="report-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Hotel</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="isLoading()">
                <td colspan="9" class="loading-state">
                  <div class="spinner"></div>
                  Loading records...
                </td>
              </tr>
              
              <tr *ngIf="!isLoading() && bookings().length === 0">
                <td colspan="9" class="empty-state">
                  No bookings found in the system.
                </td>
              </tr>

              <tr *ngFor="let booking of bookings()" class="data-row">
                <td><span class="booking-id">#{{ booking.bookingId }}</span></td>
                <td>
                  <div class="user-cell">
                    <strong>{{ booking.userName }}</strong>
                  </div>
                </td>
                <td>
                  <div class="hotel-cell">
                    <strong>{{ booking.hotelName }}</strong>
                    <span class="sub" *ngIf="booking.city">{{ booking.city }}, {{ booking.state }}</span>
                  </div>
                </td>
                <td><span class="room-label">{{ booking.roomLabel }}</span></td>
                <td>{{ booking.checkInDate | date:'mediumDate' }}</td>
                <td>{{ booking.checkOutDate | date:'mediumDate' }}</td>
                <td><strong class="amount">\${{ booking.totalPrice | number:'1.2-2' }}</strong></td>
                <td>
                  <span class="status-badge" [class]="booking.status.toLowerCase()">
                    {{ booking.status }}
                  </span>
                </td>
                <td><span class="sub">{{ booking.bookingDate | date:'mediumDate' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="report-footer">
          <div class="pagination-info">
            Showing {{ bookings().length }} of {{ bookings().length }} entries
          </div>
          <div class="pagination-controls">
            <button class="page-btn" disabled>
              <lucide-icon name="chevron-left" size="18"></lucide-icon>
              Previous
            </button>
            <button class="page-btn active">1</button>
            <button class="page-btn" disabled>
              Next
              <lucide-icon name="chevron-right" size="18"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-page { display: flex; flex-direction: column; gap: 32px; padding: 16px; }
    .report-header { display: flex; justify-content: space-between; align-items: flex-end; }
    .title-section h1 { font-size: 32px; font-family: 'Outfit', sans-serif; color: #0f172a; margin-bottom: 8px; }
    .title-section p { color: #64748b; font-size: 14px; }
    .action-section { display: flex; gap: 12px; }
    .btn-secondary { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
    .report-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; overflow: hidden; }
    .table-container { overflow-x: auto; }
    .report-table { width: 100%; border-collapse: collapse; text-align: left; }
    .report-table th { padding: 18px 24px; background: #f8fafc; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
    .report-table td { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }
    .data-row:hover { background: #fbfcfe; }
    .booking-id { font-family: monospace; color: #64748b; font-weight: 500; }
    .hotel-cell strong, .user-cell strong { display: block; color: #1e293b; font-size: 14px; margin-bottom: 2px; }
    .sub { display: block; font-size: 12px; color: #94a3b8; }
    .room-label { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #475569; }
    .amount { color: #0f172a; font-size: 15px; }
    .status-badge { display: inline-flex; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.02em; }
    .status-badge.confirmed { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
    .status-badge.cancelled { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }
    .loading-state, .empty-state { text-align: center; padding: 64px !important; color: #64748b; }
    .spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .report-footer { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .pagination-info { font-size: 14px; color: #64748b; }
    .pagination-controls { display: flex; gap: 8px; }
    .page-btn { display: flex; align-items: center; gap: 4px; padding: 8px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; }
    .page-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
    .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .page-btn:not(:disabled):hover:not(.active) { background: #f1f5f9; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private bookingService = inject(BookingService);
  
  bookings = signal<Booking[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadBookings();
  }

  exportCSV() {
    const data = this.bookings();
    if (data.length === 0) return;

    const headers = ['Booking ID', 'User', 'Hotel', 'Room', 'Check-in', 'Check-out', 'Price', 'Status', 'Booking Date'];
    const csvContent = data.map(b => [
      b.bookingId,
      b.userName,
      b.hotelName,
      b.roomLabel,
      b.checkInDate,
      b.checkOutDate,
      b.totalPrice,
      b.status,
      b.bookingDate
    ].join(','));

    const blob = new Blob([[headers.join(','), ...csvContent].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingService.getAllBookings().subscribe({
      next: (response: any) => {
        let data = Array.isArray(response) ? response : (response.data || []);
        
        const sortedData = data.sort((a: any, b: any) => {
          const dateA = new Date(a.bookingDate || a.createdAt || 0).getTime();
          const dateB = new Date(b.bookingDate || b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
        this.bookings.set(sortedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.isLoading.set(false);
      }
    });
  }
}
