import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmlData } from '../../models/corrosion-data.interface';
import { CorrosionDataService } from '../../services/corrosion-data.service';

@Component({
  selector: 'app-tml-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isVisible" 
      class="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center"
      (click)="closeModal()">
      <div 
        class="modal-content"
        (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">TMLs by Circuit</h2>
            <button 
              (click)="downloadCsv()" 
              class="download-btn">
              Download CSV
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="modal-body">
          
          <!-- AI Notes Section -->
          <div class="mb-6">
            <h3 class="section-title">AI Notes</h3>
            <div class="ai-notes-box">
              <p class="ai-notes-text">
                Most TMLs in this group belong to aging pipelines with high moisture exposure and minimal insulation. Recommend prioritizing circuits with repeated entries across categories.
              </p>
            </div>
          </div>

          <!-- TML & Circuit IDs Section -->
          <div class="circuit-group">
            <h3 class="section-title">TML & Circuit IDs</h3>
            <div>
              <div *ngFor="let circuit of getCircuitEntries()" class="circuit-container">
                <div class="circuit-title">{{circuit.key}}</div>
                <ul class="tml-list">
                  <li *ngFor="let tml of circuit.value" class="tml-item">
                    <span class="bullet-point"></span>
                    {{tml}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button 
            (click)="closeModal()" 
            class="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class TmlModalComponent {
  @Input() isVisible = false;
  @Input() tmlData: TmlData | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private corrosionDataService: CorrosionDataService) {}

  getCircuitEntries(): Array<{key: string, value: string[]}> {
    if (!this.tmlData) return [];
    return Object.entries(this.tmlData).map(([key, value]) => ({ key, value }));
  }

  closeModal(): void {
    this.close.emit();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  downloadCsv(): void {
    if (!this.tmlData) return;
    
    // Generate CSV content from the modal data
    let csvContent = "Circuit ID,TML ID\n";
    
    Object.entries(this.tmlData).forEach(([circuitId, tmlIds]) => {
      tmlIds.forEach(tmlId => {
        csvContent += `"${circuitId}","${tmlId}"\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tmls_by_circuit.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}