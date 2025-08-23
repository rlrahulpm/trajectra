import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { CorrosionData, TmlData } from '../models/corrosion-data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorrosionDataService {
  private dataSubject = new BehaviorSubject<CorrosionData>({ nodes: [], links: [] });
  public data$ = this.dataSubject.asObservable();
  private apiLoaded = false;

  constructor(private http: HttpClient) {
    this.loadApiData();
  }

  private async loadApiData(): Promise<void> {
    try {
      const corrosionData = await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/corrosion-data`));
      if (corrosionData && corrosionData.length > 0) {
        this.apiLoaded = true;
        console.log('API data loaded:', corrosionData.length, 'records');
        this.generateSankeyFromApiData(corrosionData);
      }
    } catch (error) {
      console.error('Error loading API data:', error);
    }
  }

  private generateSankeyFromApiData(apiData: any[]): void {
    console.log('Generating Sankey from API data:', apiData);
    
    // Create nodes for the Sankey diagram
    const nodes = [
      { name: `TMLs with CR <= 50 mpy (${new Date().toLocaleDateString()})` },
      { name: "< 10 mpy" },
      { name: "10-20 mpy" },
      { name: "20-30 mpy" },
      { name: "30-50 mpy" },
      { name: "> 50 mpy" }
    ];

    // Create links from API data
    const links: any[] = [];
    
    // Group by risk categories
    const categoryMap: { [key: string]: number } = {
      '< 10 mpy': 1,
      '10-20 mpy': 2, 
      '20-30 mpy': 3,
      '30-50 mpy': 4,
      '> 50 mpy': 5
    };

    // Process API data to create links
    apiData.forEach(record => {
      const targetIndex = categoryMap[record.target];
      if (targetIndex) {
        const existingLink = links.find(link => 
          link.source === 0 && link.target === targetIndex
        );
        
        if (existingLink) {
          existingLink.value += record.value;
        } else {
          links.push({
            source: 0,
            target: targetIndex,
            value: record.value,
            tmls: { [record.source]: [`TML-${record.source}`] }
          });
        }
      }
    });

    const sankeyData = { nodes, links };
    console.log('Generated Sankey data:', sankeyData);
    this.dataSubject.next(sankeyData);
  }

  private generateSankeyFromTemporalData(temporalData: any[], startDate: string, endDate: string, maxCorrosionRate: number): void {
    console.log('Generating Sankey from temporal data:', temporalData);
    
    // Create nodes for the Sankey diagram
    const nodes = [
      { name: `TMLs with CR ≤ ${maxCorrosionRate} mpy (${startDate})` },
      { name: "< 10 mpy" },
      { name: "10-20 mpy" },
      { name: "20-30 mpy" },
      { name: "30-50 mpy" },
      { name: "> 50 mpy" }
    ];

    // Create links from temporal tracking data
    const links: any[] = [];
    
    // Group by end category
    const categoryMap: { [key: string]: number } = {
      '< 10 mpy': 1,
      '10-20 mpy': 2, 
      '20-30 mpy': 3,
      '30-50 mpy': 4,
      '> 50 mpy': 5
    };

    // Group TMLs by their end category
    const categoryGroups: { [key: string]: any[] } = {};
    
    temporalData.forEach(record => {
      const category = record.endCategory || record.endcategory; // Handle different case formats
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push(record);
    });

    // Create links for each category
    Object.entries(categoryGroups).forEach(([category, records]) => {
      const targetIndex = categoryMap[category];
      if (targetIndex && records.length > 0) {
        // Create TML data for this category
        const tmlData: { [key: string]: string[] } = {};
        records.forEach(record => {
          const circuitId = record.circuitId || record.circuitid;
          const tmlId = record.tmlId || record.tmlid;
          
          if (!tmlData[circuitId]) {
            tmlData[circuitId] = [];
          }
          tmlData[circuitId].push(tmlId);
        });

        links.push({
          source: 0,
          target: targetIndex,
          value: records.length,
          tmls: tmlData
        });
      }
    });

    const sankeyData = { nodes, links };
    console.log('Generated temporal Sankey data:', sankeyData);
    this.dataSubject.next(sankeyData);
  }

  async filterAndGenerateSankeyData(startDate: string, endDate: string, maxCorrosionRate: number): Promise<void> {
    try {
      console.log('Generating temporal tracking data with:', { startDate, endDate, maxCorrosionRate });
      const temporalData = await this.getTemporalTracking(startDate, endDate, maxCorrosionRate);
      console.log('Received temporal tracking data:', temporalData);
      
      if (temporalData && temporalData.length > 0) {
        this.generateSankeyFromTemporalData(temporalData, startDate, endDate, maxCorrosionRate);
      } else {
        console.log('No temporal tracking data found');
        // Generate empty Sankey data
        const emptyData = {
          nodes: [
            { name: `TMLs with CR ≤ ${maxCorrosionRate} mpy (${startDate})` },
            { name: "< 10 mpy" },
            { name: "10-20 mpy" },
            { name: "20-30 mpy" },
            { name: "30-50 mpy" },
            { name: "> 50 mpy" }
          ],
          links: []
        };
        this.dataSubject.next(emptyData);
      }
    } catch (error) {
      console.error('Error generating temporal tracking data:', error);
    }
  }


  getData(): CorrosionData {
    return this.dataSubject.value;
  }

  generateTmlCsv(): string {
    const currentData = this.dataSubject.value;
    let rows = ["Circuit ID,TML ID,Risk Level"];
    currentData.links.forEach(link => {
      if (!link.tmls) return;
      const riskLevel = currentData.nodes[link.target]?.name || 'Unknown';
      for (const [circuit, ids] of Object.entries(link.tmls)) {
        ids.forEach((tml: string) => {
          rows.push(`${circuit},${tml},${riskLevel}`);
        });
      }
    });
    return rows.join("\n");
  }

  // Add method to fetch additional data from API if needed
  async getTmlPoints(): Promise<any[]> {
    try {
      return await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/tml-points`));
    } catch (error) {
      console.error('Error loading TML points:', error);
      return [];
    }
  }

  async getMeasurements(): Promise<any[]> {
    try {
      return await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/measurements`));
    } catch (error) {
      console.error('Error loading measurements:', error);
      return [];
    }
  }

  async getAvailableDates(): Promise<string[]> {
    try {
      return await firstValueFrom(this.http.get<string[]>(`${environment.apiUrl}/measurements/dates`));
    } catch (error) {
      console.error('Error loading available dates:', error);
      return [];
    }
  }

  async getTemporalTracking(startDate: string, endDate: string, maxCorrosionRate: number): Promise<any[]> {
    try {
      const params = {
        startDate,
        endDate,
        maxCorrosionRate: maxCorrosionRate.toString()
      };
      return await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/temporal/tracking`, { params }));
    } catch (error) {
      console.error('Error loading temporal tracking data:', error);
      return [];
    }
  }
}