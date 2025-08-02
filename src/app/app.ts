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

  constructor(private corrosionDataService: CorrosionDataService) {}

  ngOnInit(): void {
    // Set initial dates
    this.startDate.set('2025-01-01');
    this.endDate.set('2025-03-31');
    
    // Subscribe to data changes
    this.corrosionDataService.data$.subscribe(data => {
      this.currentData.set(data);
    });
    
    // Initial data load with default rate
    this.updateChart();
  }

  onInputChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
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
    }
    
    this.updateChart();
  }

  private updateChart(): void {
    const rate = parseFloat(this.initialRate());
    if (!isNaN(rate)) {
      this.corrosionDataService.filterAndGenerateSankeyData(rate);
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
}
