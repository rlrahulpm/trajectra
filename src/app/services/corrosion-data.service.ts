import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { CorrosionData, TmlData, CsvCorrosionRecord } from '../models/corrosion-data.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CorrosionDataService {
  private csvData: CsvCorrosionRecord[] = [];
  private dataSubject = new BehaviorSubject<CorrosionData>({ nodes: [], links: [] });
  public data$ = this.dataSubject.asObservable();
  private csvLoaded = false;

  constructor(private http: HttpClient) {
    this.loadCsvData();
  }

  private async loadCsvData(): Promise<void> {
    try {
      const csvText = await firstValueFrom(this.http.get('corrosion-data.csv', { responseType: 'text' }));
      if (csvText) {
        this.csvData = this.parseCsv(csvText);
        this.csvLoaded = true;
        console.log('CSV data loaded:', this.csvData.length, 'records');
      }
    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }

  private parseCsv(csvText: string): CsvCorrosionRecord[] {
    const lines = csvText.split('\n');
    const records: CsvCorrosionRecord[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const [circuitId, tmlId, corrosionRateA, corrosionRateB] = line.split(',');
        records.push({
          circuitId: circuitId?.trim() || '',
          tmlId: tmlId?.trim() || '',
          corrosionRateA: parseFloat(corrosionRateA?.trim() || '0'),
          corrosionRateB: parseFloat(corrosionRateB?.trim() || '0')
        });
      }
    }
    
    return records;
  }

  filterAndGenerateSankeyData(maxCorrosionRate: number): void {
    if (!this.csvLoaded || this.csvData.length === 0) {
      console.log('CSV data not loaded yet, waiting...');
      setTimeout(() => this.filterAndGenerateSankeyData(maxCorrosionRate), 100);
      return;
    }
    
    console.log('Filtering data with max rate:', maxCorrosionRate);
    const filteredData = this.csvData.filter(record => record.corrosionRateA <= maxCorrosionRate);
    console.log('Filtered records:', filteredData.length);
    
    const sankeyData = this.generateSankeyFromFilteredData(filteredData, maxCorrosionRate);
    console.log('Generated Sankey data:', sankeyData);
    this.dataSubject.next(sankeyData);
  }

  private generateSankeyFromFilteredData(filteredData: CsvCorrosionRecord[], maxRate: number): CorrosionData {
    const nodes = [
      { name: `TMLs with CR <= ${maxRate} mpy (01-01-2025)` },
      { name: "< 10 mpy" },
      { name: "10-20 mpy" },
      { name: "20-30 mpy" },
      { name: "30-50 mpy" },
      { name: "> 50 mpy" }
    ];

    const categoryGroups: { [key: number]: CsvCorrosionRecord[] } = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: []
    };

    filteredData.forEach(record => {
      const rateB = record.corrosionRateB;
      if (rateB < 10) categoryGroups[1].push(record);
      else if (rateB < 20) categoryGroups[2].push(record);
      else if (rateB < 30) categoryGroups[3].push(record);
      else if (rateB < 50) categoryGroups[4].push(record);
      else categoryGroups[5].push(record);
    });

    const links = [];
    for (let i = 1; i <= 5; i++) {
      const records = categoryGroups[i];
      if (records.length > 0) {
        const tmls: TmlData = {};
        records.forEach(record => {
          if (!tmls[record.circuitId]) {
            tmls[record.circuitId] = [];
          }
          tmls[record.circuitId].push(record.tmlId);
        });

        links.push({
          source: 0,
          target: i,
          value: records.length,
          tmls: tmls
        });
      }
    }

    return { nodes, links };
  }

  getData(): CorrosionData {
    return this.dataSubject.value;
  }

  generateTmlCsv(): string {
    const currentData = this.dataSubject.value;
    let rows = ["Circuit ID,TML ID"];
    currentData.links.forEach(link => {
      if (!link.tmls) return;
      for (const [circuit, ids] of Object.entries(link.tmls)) {
        ids.forEach(tml => {
          rows.push(`${circuit},${tml}`);
        });
      }
    });
    return rows.join("\n");
  }
}