import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SankeyChartComponent } from './components/sankey-chart/sankey-chart.component';
import { TmlModalComponent } from './components/tml-modal/tml-modal.component';
import { CorrosionDataService } from './services/corrosion-data.service';
import { CorrosionData, TmlData } from './models/corrosion-data.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SankeyChartComponent, TmlModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly initialRate = signal('20');
  protected readonly startDate = signal('');
  protected readonly endDate = signal('');
  protected readonly currentData = signal<CorrosionData | null>(null);
  protected readonly isModalVisible = signal(false);
  protected readonly selectedTmlData = signal<TmlData | null>(null);
  protected readonly availableDates = signal<string[]>([]);
  protected readonly availableMonths = signal<string[]>([]);
  protected readonly selectedStartMonth = signal('');
  protected readonly selectedEndMonth = signal('');
  private dateToMonthMap = new Map<string, string[]>(); // month -> [dates]

  constructor(private corrosionDataService: CorrosionDataService) {}

  async ngOnInit(): Promise<void> {
    // Subscribe to data changes first
    this.corrosionDataService.data$.subscribe(data => {
      this.currentData.set(data);
    });
    
    // Load available dates from backend
    try {
      const dates = await this.corrosionDataService.getAvailableDates();
      console.log('Loaded available dates:', dates);
      this.availableDates.set(dates);
      
      // Process dates to extract unique months
      this.processDatesByMonth(dates);
      
      // Set initial dates to first and last available dates if they exist
      if (dates.length > 0) {
        this.startDate.set(dates[0]);
        this.endDate.set(dates[dates.length - 1]);
        
        // Set initial months
        const startMonth = this.getMonthName(dates[0]);
        const endMonth = this.getMonthName(dates[dates.length - 1]);
        this.selectedStartMonth.set(startMonth);
        this.selectedEndMonth.set(endMonth);
        
        console.log('Set initial dates:', dates[0], 'to', dates[dates.length - 1]);
        console.log('Set initial months:', startMonth, 'to', endMonth);
      }
    } catch (error) {
      console.error('Error loading available dates:', error);
      // Fallback to default dates
      this.startDate.set('2025-01-01');
      this.endDate.set('2025-03-31');
      this.selectedStartMonth.set('January');
      this.selectedEndMonth.set('March');
    }
    
    // Initial data load with default rate - now dates are guaranteed to be set
    this.updateChart();
  }

  onInputChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    
    switch (field) {
      case 'initialRate':
        this.initialRate.set(value);
        break;
      case 'startDate':
        this.startDate.set(value);
        break;
      case 'endDate':
        this.endDate.set(value);
        break;
      case 'startMonth':
        this.selectedStartMonth.set(value);
        // Find first date for this month and set it
        const startDates = this.dateToMonthMap.get(value);
        if (startDates && startDates.length > 0) {
          this.startDate.set(startDates[0]);
        }
        break;
      case 'endMonth':
        this.selectedEndMonth.set(value);
        // Find first date for this month and set it
        const endDates = this.dateToMonthMap.get(value);
        if (endDates && endDates.length > 0) {
          this.endDate.set(endDates[0]);
        }
        break;
    }
    
    this.updateChart();
  }

  private updateChart(): void {
    const rate = parseFloat(this.initialRate());
    const start = this.startDate();
    const end = this.endDate();
    
    if (!isNaN(rate) && start && end) {
      this.corrosionDataService.filterAndGenerateSankeyData(start, end, rate);
    }
  }

  onLinkClick(tmlData: TmlData): void {
    this.selectedTmlData.set(tmlData);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedTmlData.set(null);
  }

  getTotalTmlCount(): number {
    const data = this.currentData();
    if (!data || !data.links) return 0;
    
    // Sum up all the TML counts from the source links
    return data.links.reduce((total, link) => {
      // Links from source node (index 0) represent the flow to each category
      if (link.source === 0) {
        return total + (link.value || 0);
      }
      return total;
    }, 0);
  }

  private processDatesByMonth(dates: string[]): void {
    this.dateToMonthMap.clear();
    
    // Group dates by month
    dates.forEach(date => {
      const monthName = this.getMonthName(date);
      if (!this.dateToMonthMap.has(monthName)) {
        this.dateToMonthMap.set(monthName, []);
      }
      this.dateToMonthMap.get(monthName)!.push(date);
    });
    
    // Get unique months and sort chronologically
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const uniqueMonths = Array.from(this.dateToMonthMap.keys())
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    
    this.availableMonths.set(uniqueMonths);
    
    console.log('Processed months (chronological):', uniqueMonths);
    console.log('Month to date mapping:', this.dateToMonthMap);
  }

  private getMonthName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'long' });
  }

}
