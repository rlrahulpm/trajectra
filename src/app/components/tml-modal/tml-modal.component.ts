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
        class="bg-white p-6 rounded shadow-lg max-w-4xl w-full max-h-90vh overflow-y-auto"
        (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">TMLs by Circuit</h2>
          <button 
            (click)="downloadCsv()" 
            class="px-3 py-1 bg-green-600 text-white rounded text-sm">
            Download CSV
          </button>
        </div>
        <div class="grid grid-cols-2 gap-6 mb-4">
          <div>
            <h3 class="font-semibold mb-3 text-gray-900">TML & Circuit IDs</h3>
            <div class="text-sm">
              <div *ngFor="let circuit of getCircuitEntries()" class="mb-2">
                <strong>{{circuit.key}}</strong>
                <ul class="list-disc list-inside text-gray-700">
                  <li *ngFor="let tml of circuit.value">{{tml}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 class="font-semibold mb-3 text-gray-900">AI Notes</h3>
            <div class="bg-gray-100 p-3 rounded text-sm text-gray-700">
              <p>Most TMLs in this group belong to aging pipelines with high moisture exposure and minimal insulation. Recommend prioritizing circuits with repeated entries across categories.</p>
            </div>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button 
            (click)="closeModal()" 
            class="px-4 py-2 bg-blue-600 text-white rounded">
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