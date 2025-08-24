import { Component, signal, OnInit, computed } from '@angular/core';
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

  // Computed signal for available end months (excludes start month and earlier months)
  protected readonly availableEndMonths = computed(() => {
    const startMonth = this.selectedStartMonth();
    const allMonths = this.availableMonths();
    
    if (!startMonth || allMonths.length === 0) {
      return allMonths;
    }
    
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const startMonthIndex = monthOrder.indexOf(startMonth);
    
    // Return only months that come after the start month
    return allMonths.filter(month => {
      const monthIndex = monthOrder.indexOf(month);
      return monthIndex > startMonthIndex;
    });
  });

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
        this.selectedStartMonth.set(startMonth);
        
        // Find a valid end month that comes after start month
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const startMonthIndex = monthOrder.indexOf(startMonth);
        
        // Find the first available month that comes after the start month
        let validEndMonth = '';
        for (const month of this.availableMonths()) {
          const monthIndex = monthOrder.indexOf(month);
          if (monthIndex > startMonthIndex) {
            validEndMonth = month;
            break;
          }
        }
        
        if (validEndMonth) {
          this.selectedEndMonth.set(validEndMonth);
          // Set the corresponding date
          const endDates = this.dateToMonthMap.get(validEndMonth);
          if (endDates && endDates.length > 0) {
            this.endDate.set(endDates[0]);
          }
        }
        
        console.log('Set initial dates:', dates[0], 'to', this.endDate());
        console.log('Set initial months:', startMonth, 'to', validEndMonth);
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
        
        // Check if current end month is still valid (comes after new start month)
        const currentEndMonth = this.selectedEndMonth();
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const newStartMonthIndex = monthOrder.indexOf(value);
        const currentEndMonthIndex = monthOrder.indexOf(currentEndMonth);
        
        if (currentEndMonthIndex <= newStartMonthIndex) {
          // Find the first available month after the new start month
          let validEndMonth = '';
          for (const month of this.availableMonths()) {
            const monthIndex = monthOrder.indexOf(month);
            if (monthIndex > newStartMonthIndex) {
              validEndMonth = month;
              break;
            }
          }
          
          if (validEndMonth) {
            this.selectedEndMonth.set(validEndMonth);
            const endDates = this.dateToMonthMap.get(validEndMonth);
            if (endDates && endDates.length > 0) {
              this.endDate.set(endDates[0]);
            }
          }
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

  onNodeExpand(expandData: {nodeData: any, tmlData: any[]}): void {
    console.log('Node expansion requested:', expandData);
    
    // Get the next month after the current end month for drill-down
    const currentEndMonth = this.selectedEndMonth();
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentEndMonthIndex = monthOrder.indexOf(currentEndMonth);
    const nextMonth = monthOrder[currentEndMonthIndex + 1];
    
    if (nextMonth && this.availableMonths().includes(nextMonth)) {
      // Find the date for the next month
      const nextDates = this.dateToMonthMap.get(nextMonth);
      if (nextDates && nextDates.length > 0) {
        const nextDate = nextDates[0];
        console.log('Expanding to next month:', nextMonth, 'Date:', nextDate);
        
        // Request expanded Sankey data
        this.corrosionDataService.generateExpandedSankeyData(
          this.startDate(),
          this.endDate(),
          nextDate,
          parseFloat(this.initialRate()),
          expandData.nodeData,
          expandData.tmlData
        );
      }
    } else {
      console.log('No next month available for expansion');
    }
  }

  onBackClick(): void {
    console.log('Back button clicked - returning to original view');
    // Return to the original temporal tracking view
    this.updateChart();
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

  getChartDescription(): string {
    const data = this.currentData();
    if (!data || !data.nodes || data.nodes.length === 0) {
      return 'Loading chart data...';
    }

    // Check if this is an expanded view (drill-down)
    const isExpandedView = data.nodes.length > 0 && 
      data.nodes[0].name.includes('TMLs from') && 
      data.nodes[0].name.includes('category');

    if (isExpandedView) {
      // Extract information from the source node name
      const sourceName = data.nodes[0].name;
      // Example: "3 TMLs from 20-30 mpy category (February)"
      const countMatch = sourceName.match(/(\d+) TMLs from (.+) category \((.+)\)/);
      
      if (countMatch) {
        const count = countMatch[1];
        const category = countMatch[2];
        const fromMonth = countMatch[3];
        
        // Get the target month from the available end months or next month
        const nextMonth = this.getNextMonth(fromMonth);
        
        return `${count} TMLs with corrosion rate of ${category} (${fromMonth}) flowing to corrosion rate categories by ${nextMonth}. Click on any flow to view detailed TML and circuit information.`;
      }
    }

    // Default description for main view
    const totalCount = this.getTotalTmlCount();
    const rate = this.initialRate();
    const startMonth = this.selectedStartMonth();
    const endMonth = this.selectedEndMonth();

    return `${totalCount} TMLs with CR ≤ ${rate} mpy (${startMonth}) flowing to corrosion rate categories by ${endMonth}. Click on any flow to view detailed TML and circuit information.`;
  }

  private getNextMonth(currentMonth: string): string {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentIndex = monthOrder.indexOf(currentMonth);
    if (currentIndex >= 0 && currentIndex < monthOrder.length - 1) {
      return monthOrder[currentIndex + 1];
    }
    
    // Fallback to the selected end month if we can't determine the next month
    return this.selectedEndMonth() || 'March';
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
