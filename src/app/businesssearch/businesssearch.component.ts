import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BusinessService } from '../service/business.service';
import { GoogleMapsModule } from '@angular/google-maps';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
export interface Business {
  name: string;
  description: string;
  image: string;
  distanceKm: number;
}
@Component({
  selector: 'app-businesssearch',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatTabsModule, GoogleMapsModule, FormsModule],
  providers: [BusinessService],
  templateUrl: './businesssearch.component.html',
  styleUrl: './businesssearch.component.css'
})
export class BusinesssearchComponent implements OnInit {
  searchForm !: FormGroup;
  categories: any[] = [];
  businessList: any[] = [];
  fileUpload: any;
  isTableVisible: boolean = false; // Table visibility flag
  imageBaseUrl = 'https://localhost:7000/uploads/';
  latitudeDifference: number | null = null;
  longitudeDifference: number | null = null;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 }; // Default to San Francisco
  zoom = 10;
  marker: google.maps.LatLngLiteral | null = null;

  selectedCategory!: string;
  selectedSubCategory!: string;
  selectedBusiness: any = null; // Initially null
  subCategories: any;
  businessDetail: any; 
  newLocation: any;
  newLatitude: any;
  newLongtitude: any; 
  distance: any;

  constructor(private fb: FormBuilder, private businessService: BusinessService, private router: Router) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      location: new FormControl('', [Validators.required]),
      Latitude: [8.3],
      Longitude: [9.3],
    });

    this.getCategories();
    this.getCurrentLocation();
    console.log(this.categories, "test")
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.center = { lat, lng };
          this.marker = { ...this.center };
          this.getLocationName(lat, lng); // Fetch and set the location name
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not retrieve your location. Default location will be used.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.marker = { lat, lng };
      this.getLocationName(lat, lng); // Fetch and set the location name
    }
  }

  onLocationInput(): void {
    const location = this.selectedBusiness?.location;
    if (location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          this.center = { lat, lng };
          this.marker = { lat, lng };
          this.updateLocationFields(location, lat, lng);
        } else {
          alert('Could not find the location. Please try again.');
        }
      });
    }
  }

  getLocationName(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const locationName = results[0].formatted_address;
        this.updateLocationFields(locationName, lat, lng);
      } else {
        console.error('Error fetching location name:', status);
      }
    });
  }

  onCalculateBusiness(): void {
    if (this.selectedBusiness.latitude !== null && this.newLatitude !== null) {
      this.latitudeDifference = this.newLatitude - this.selectedBusiness.latitude;
    } else {
      this.latitudeDifference = null;
    }
 
    if (this.selectedBusiness.longitude !== null && this.newLongtitude !== null) {
      this.longitudeDifference = this.newLongtitude - this.selectedBusiness.longitude;
    } else {
      this.longitudeDifference = null;
    }
  }

  updateLocationFields(location: string, lat: number, lng: number): void {
    this.selectedBusiness.location = location
    this.selectedBusiness.longitude = lat
    this.selectedBusiness.latitude = lng
  }

  // Method to generate the full image URL
  getImageUrl(visitingCard: string): string {
    return `${this.imageBaseUrl}${visitingCard?.split("\\").pop()}`;
  }

  // Handle category selection
  selectCategory(category: any): void {
    this.selectedCategory = category?.categoryName;
    this.getSubCategories(category?.categoryID)
  }

  getSubCategories(id: any) {
    this.businessService.getSubCategories(id).subscribe((result: any) => {
      this.subCategories = result;
    })
  } 

  getBusinessDetailById(id: any) {
    // debugger
    this.businessService.getBusinessDetailById(id).subscribe((result: any) => {
      this.selectedBusiness = result[0];
      console.log(this.selectedBusiness, '-ppp');

    })
  }

  callSearch() {
    this.businessService.searchBusinesses(this.selectedCategory, this.selectedSubCategory).subscribe((result: any) => {
      this.businessList = result;

      console.log(this.businessList, "bus")
      this.isTableVisible = true;
    })
  }

  replacePercentage(val: any) {
    console.log(val);
    return val;
  }

  get FormVal() {
    return this.searchForm.value
  }


  getCategories(): void {
    this.businessService.getCategories().subscribe((data) => {
      this.categories = data;
      if (!this.FormVal?.CategoryID) {
        this.searchForm.controls['CategoryID'].setValue(data[0]?.categoryID)
      }
    });
  }

  // Handle subcategory selection
  selectSubcategory(subcategory: any): void {
    this.selectedSubCategory = subcategory?.subCategoryName
  }

  // Handle form submission
  onSubmit(): void {
    if (this.searchForm.valid) {
      console.log('Form Submitted:', this.searchForm.value);
    } else {
      console.error('Form is invalid');
    }
  }

  // View business details when a name is clicked
  viewBusinessDetails(business: any): void {
    this.selectedBusiness = business;
  }

  // Open popup with selected business details
  openPopup(business: any): void {
    this.selectedBusiness = business;
  }

  // Close the popup
  closePopup(): void {
    this.selectedBusiness = null;
  }

  submitBusiness(distance: any) {
    const formData = new FormData();   

    Object.keys(this.selectedBusiness).forEach((key) => {
      if (key === 'image') {
        // Append the file separately
        formData.append(key, this.selectedBusiness[key], this.selectedBusiness[key].name);
      } else {
        // Append other fields
        formData.append(key, this.selectedBusiness[key]);
      }
    });

    // Call the business registration service
    this.businessService.updateBusiness(formData).subscribe({
      next: (response: any) => {
        if (response) {
          // Show success popup using SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Successfully updated!',
            confirmButtonText: 'OK',
          });

          //this.registerForm.reset();
          this.router.navigateByUrl('/login');
        } else {
          // Show failure popup using SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'update failed!',
            confirmButtonText: 'Try Again',
          });
        }
      },
      error: (error: any) => {
        // Handle errors during registration
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during registration. Please try again.',
          confirmButtonText: 'Close',
        });
        this.searchForm.reset();
        console.error('update error:', error);
      }
    });
  }
}
