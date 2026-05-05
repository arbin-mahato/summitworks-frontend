import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="confirmation-page">
      <div class="confirmation-card" *ngIf="booking(); else noBooking">
        <div class="success-header">
          <div class="icon-circle">
            <lucide-icon name="check" size="40"></lucide-icon>
          </div>
          <h1>Booking Confirmed!</h1>
          <p class="message">{{ booking().message }}</p>
        </div>

        <div class="receipt-body">
          <div class="info-section">
            <div class="info-row">
              <span class="label">Booking ID</span>
              <span class="value">#{{ booking().bookingId }}</span>
            </div>
            <div class="info-row">
              <span class="label">Hotel</span>
              <span class="value">{{ booking().hotelName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Room</span>
              <span class="value">{{ booking().roomLabel }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="info-section">
            <div class="info-row">
              <span class="label">Check-in</span>
              <span class="value">{{ booking().checkInDate | date:'fullDate' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Check-out</span>
              <span class="value">{{ booking().checkOutDate | date:'fullDate' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Status</span>
              <span class="status-badge" [class]="booking().status.toLowerCase()">
                {{ booking().status }}
              </span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="total-section">
            <div class="info-row total">
              <span class="label">Total Paid</span>
              <span class="value">\${{ booking().totalPrice | number:'1.2-2' }}</span>
            </div>
            <p class="booking-date">Booked on {{ booking().bookingDate | date:'medium' }}</p>
          </div>
        </div>

        <div class="actions">
          <button routerLink="/app/bookings" class="primary-btn">
            View My Bookings
            <lucide-icon name="calendar" size="18"></lucide-icon>
          </button>
          <button routerLink="/app/hotels" class="secondary-btn">
            Back to Hotels
          </button>
        </div>
      </div>

      <ng-template #noBooking>
        <div class="no-booking">
          <lucide-icon name="alert-circle" size="48"></lucide-icon>
          <h2>No Booking Found</h2>
          <p>We couldn't find any recent booking details.</p>
          <button routerLink="/app/hotels" class="primary-btn">Go Back to Hotels</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: #f8fafc;
    }

    .confirmation-card {
      background: white;
      width: 100%;
      max-width: 500px;
      border-radius: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .success-header {
      background: linear-gradient(135deg, #059669, #10b981);
      padding: 40px;
      text-align: center;
      color: white;
    }

    .icon-circle {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      backdrop-filter: blur(4px);
      border: 2px solid rgba(255, 255, 255, 0.4);
    }

    .success-header h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .message {
      font-size: 14px;
      opacity: 0.9;
    }

    .receipt-body {
      padding: 40px;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .value {
      font-size: 15px;
      color: #1e293b;
      font-weight: 700;
    }

    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 24px 0;
      border-top: 1px dashed #e2e8f0;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
    }

    .status-badge.confirmed {
      background: #ecfdf5;
      color: #059669;
    }

    .total-section {
      background: #f8fafc;
      padding: 24px;
      border-radius: 16px;
      text-align: center;
    }

    .info-row.total .label { color: #1e293b; font-size: 14px; }
    .info-row.total .value { color: #059669; font-size: 24px; }

    .booking-date {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 8px;
    }

    .actions {
      padding: 0 40px 40px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .primary-btn {
      width: 100%;
      height: 48px;
      background: #1e293b;
      color: white;
      border-radius: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .primary-btn:hover { background: #0f172a; transform: translateY(-1px); }

    .secondary-btn {
      width: 100%;
      height: 48px;
      background: transparent;
      color: #64748b;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .secondary-btn:hover { background: #f8fafc; color: #1e293b; }

    .no-booking {
      text-align: center;
      padding: 60px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .no-booking lucide-icon { color: #facc15; margin-bottom: 20px; }
    .no-booking h2 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .no-booking p { color: #64748b; margin-bottom: 24px; }
  `]
})
export class BookingConfirmationComponent {
  private bookingService = inject(BookingService);
  booking = this.bookingService.lastBooking;
}
