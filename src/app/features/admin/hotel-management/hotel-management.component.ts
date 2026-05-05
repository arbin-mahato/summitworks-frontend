import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, Search, Star, MapPin, Edit3, Trash2, MoreVertical, XCircle } from 'lucide-angular';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../core/models';

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Hotel Management</h1>
          <p>Create, update and manage your property listings.</p>
        </div>
        <button class="add-hotel-btn" (click)="openAddModal()">
          <lucide-icon name="plus" size="18"></lucide-icon>
          Add New Hotel
        </button>
      </div>

      <!-- Hotel Form Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Hotel' : 'Add New Hotel' }}</h2>
            <button class="close-btn" (click)="closeModal()">
              <lucide-icon name="x-circle" size="24"></lucide-icon>
            </button>
          </div>
          <form [formGroup]="hotelForm" (ngSubmit)="onSubmit()" class="hotel-form">
            <div class="form-group">
              <label>Hotel Name</label>
              <input type="text" formControlName="hotelName" placeholder="e.g. Grand Royal Sanctuary">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input type="text" formControlName="city" placeholder="e.g. Malibu">
              </div>
              <div class="form-group">
                <label>State</label>
                <input type="text" formControlName="state" placeholder="e.g. California">
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea formControlName="description" rows="3" placeholder="Describe the property..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Base Price ($)</label>
                <input type="number" formControlName="startingPrice" placeholder="299">
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="text" formControlName="image" placeholder="https://images.unsplash.com/...">
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="hotelForm.invalid">
                {{ isEditing ? 'Update Hotel' : 'Create Hotel' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="controls">
        <div class="search-box">
          <lucide-icon name="search" size="18"></lucide-icon>
          <input type="text" placeholder="Search hotels by name or location..." (input)="onSearch($event)">
        </div>
      </div>

      <div class="hotel-grid">
        <div *ngFor="let hotel of filteredHotels" class="hotel-card">
          <div class="card-image">
            <img [src]="hotel.image" [alt]="hotel.hotelName">
            <div class="rating-badge">
              <lucide-icon name="star" size="14" class="star-icon"></lucide-icon>
              {{ hotel.rating | number:'1.1-1' }}
            </div>
          </div>
          <div class="card-content">
            <div class="card-header">
              <h3 class="hotel-name">{{ hotel.hotelName }}</h3>
              <div class="actions">
                <button class="icon-btn" title="Edit" (click)="editHotel(hotel)">
                  <lucide-icon name="edit-3" size="18"></lucide-icon>
                </button>
                <button class="icon-btn danger" title="Delete" (click)="deleteHotel(hotel.hotelId)">
                  <lucide-icon name="trash-2" size="18"></lucide-icon>
                </button>
              </div>
            </div>
            <div class="location">
              <lucide-icon name="map-pin" size="14"></lucide-icon>
              {{ hotel.city }}, {{ hotel.state }}
            </div>
            <div class="hotel-info">
              <div class="info-item">
                <span class="label">Price</span>
                <span class="value">\${{ hotel.startingPrice }}/night</span>
              </div>
              <div class="info-item">
                <span class="label">Rooms</span>
                <span class="value">{{ hotel.totalRooms }} types</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-4);
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-2xl);
      width: 100%;
      max-width: 600px;
      box-shadow: var(--shadow-2xl);
      overflow: hidden;
    }

    .modal-header {
      padding: var(--space-6);
      background: var(--color-gray-50);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-gray-200);
    }

    .modal-header h2 { margin: 0; font-family: var(--font-display); }

    .close-btn { color: var(--color-gray-400); transition: color 0.2s; }
    .close-btn:hover { color: var(--color-error-500); }

    .hotel-form { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }

    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--color-gray-600); }
    .form-group input, .form-group textarea {
      padding: var(--space-3);
      border: 1px solid var(--color-gray-200);
      border-radius: var(--radius-md);
      font-family: inherit;
    }

    .form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-4); }

    .btn-primary { background: var(--gradient-primary); color: white; padding: var(--space-3) var(--space-6); border-radius: var(--radius-md); font-weight: var(--font-bold); }
    .btn-secondary { background: var(--color-gray-100); color: var(--color-gray-700); padding: var(--space-3) var(--space-6); border-radius: var(--radius-md); font-weight: var(--font-bold); }

    /* Rest of the styles... */

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h1 {
      font-family: var(--font-display);
      font-size: var(--text-3xl);
      margin-bottom: var(--space-1);
    }

    .page-header p { color: var(--color-gray-500); }

    .add-hotel-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-6);
      background: var(--gradient-primary);
      color: white;
      border-radius: var(--radius-lg);
      font-weight: var(--font-bold);
      box-shadow: var(--shadow-md);
      transition: var(--transition-base);
      border: none;
      cursor: pointer;
    }

    .add-hotel-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .controls {
      max-width: 500px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box lucide-icon {
      position: absolute;
      left: var(--space-4);
      color: var(--color-gray-400);
    }

    .search-box input {
      width: 100%;
      height: 48px;
      padding: 0 var(--space-4) 0 var(--space-12);
      border: 1px solid var(--color-gray-200);
      border-radius: var(--radius-lg);
      background: var(--color-white);
    }

    .hotel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-8);
    }

    .hotel-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-gray-100);
      transition: var(--transition-base);
    }

    .hotel-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .card-image {
      height: 200px;
      position: relative;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rating-badge {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      background: rgba(255, 255, 255, 0.9);
      padding: 4px var(--space-3);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
      backdrop-filter: blur(4px);
    }

    .star-icon {
      color: var(--color-warning-500);
      fill: var(--color-warning-500);
    }

    .card-content {
      padding: var(--space-6);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-2);
    }

    .hotel-name {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      margin-bottom: 0;
    }

    .location {
      font-size: var(--text-sm);
      color: var(--color-gray-500);
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: var(--space-6);
    }

    .hotel-info {
      display: flex;
      gap: var(--space-8);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-gray-100);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-item .label {
      font-size: 10px;
      color: var(--color-gray-400);
      text-transform: uppercase;
      font-weight: var(--font-bold);
    }

    .info-item .value {
      font-size: var(--text-sm);
      font-weight: var(--font-bold);
      color: var(--color-gray-900);
    }

    .actions {
      display: flex;
      gap: var(--space-2);
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      background: var(--color-gray-50);
      color: var(--color-gray-500);
      transition: var(--transition-base);
      border: 1px solid var(--color-gray-200);
      cursor: pointer;
    }

    .icon-btn:hover { background: var(--color-gray-100); color: var(--color-primary-600); }
    .icon-btn.danger:hover { background: var(--color-error-50); color: var(--color-error-600); border-color: var(--color-error-200); }
  `]
})
export class HotelManagementComponent implements OnInit {
  private hotelService = inject(HotelService);
  private fb = inject(FormBuilder);
  
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  searchQuery = '';

  // Form state
  showModal = false;
  isEditing = false;
  currentEditingId: number | null = null;
  hotelForm: FormGroup;

  constructor() {
    this.hotelForm = this.fb.group({
      hotelName: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      description: ['', Validators.required],
      startingPrice: [0, [Validators.required, Validators.min(1)]],
      image: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.hotels = hotels;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredHotels = this.hotels.filter(hotel => 
      hotel.hotelName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      hotel.city.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      hotel.state.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.applyFilters();
  }

  openAddModal() {
    this.isEditing = false;
    this.currentEditingId = null;
    this.hotelForm.reset({ price: 0 });
    this.showModal = true;
  }

  editHotel(hotel: Hotel) {
    this.isEditing = true;
    this.currentEditingId = hotel.hotelId;
    this.hotelForm.patchValue({
      hotelName: hotel.hotelName,
      city: hotel.city,
      state: hotel.state,
      description: hotel.description,
      startingPrice: hotel.startingPrice,
      image: hotel.image
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      const hotelData = {
        ...this.hotelForm.value,
        hotelId: this.currentEditingId
      };

      this.hotelService.saveHotel(hotelData).subscribe(() => {
        this.loadHotels();
        this.closeModal();
      });
    }
  }

  deleteHotel(id: number) {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      this.hotelService.deleteHotel(id).subscribe(() => {
        this.loadHotels();
      });
    }
  }
}
