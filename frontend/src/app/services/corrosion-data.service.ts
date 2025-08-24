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
    // Don't load default data - wait for filter parameters from the component
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
    
    // Group TMLs by their end category first
    const categoryGroups: { [key: string]: any[] } = {};
    
    temporalData.forEach(record => {
      const category = record.endCategory || record.endcategory; // Handle different case formats
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push(record);
    });

    // Only create nodes and links for categories that have data
    const nodes = [
      { name: `TMLs with <= ${maxCorrosionRate} mpy corrosion rate as on ${startDate}` }
    ];

    const links: any[] = [];
    const availableCategories = ["< 10 mpy", "10-20 mpy", "20-30 mpy", "30-50 mpy", "> 50 mpy"];
    
    let targetIndex = 1;
    
    // Only add nodes and links for categories that have data
    availableCategories.forEach(category => {
      const records = categoryGroups[category];
      if (records && records.length > 0) {
        // Add node for this category
        nodes.push({ name: category });
        
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

        // Sort TML IDs within each circuit
        Object.keys(tmlData).forEach(circuit => {
          tmlData[circuit].sort((a, b) => {
            // Extract numeric part from TML ID for proper sorting
            const numA = parseInt(a.replace(/\D/g, ''), 10);
            const numB = parseInt(b.replace(/\D/g, ''), 10);
            return numA - numB;
          });
        });

        links.push({
          source: 0,
          target: targetIndex,
          value: records.length,
          tmls: tmlData,
          tmlData: records  // Add the raw temporal data for expansion
        });
        
        targetIndex++;
      }
    });

    const sankeyData = { nodes, links };
    console.log('Generated temporal Sankey data with only populated categories:', sankeyData);
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
            { name: `TMLs with <= ${maxCorrosionRate} mpy corrosion rate as on ${startDate}` },
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

  async generateExpandedSankeyData(
    startDate: string, 
    endDate: string, 
    expandToDate: string,
    maxCorrosionRate: number, 
    expandedNodeData: any, 
    expandedTmlData: any[]
  ): Promise<void> {
    try {
      console.log('=== GENERATING EXPANDED SANKEY ===');
      console.log('Start:', startDate, 'End:', endDate, 'Expand to:', expandToDate);
      console.log('Expanded node:', expandedNodeData);
      console.log('TMLs to expand:', expandedTmlData.length);

      // Get the original temporal data for start -> end
      const originalData = await this.getTemporalTracking(startDate, endDate, maxCorrosionRate);
      
      // Get drill-down data for the specific TMLs from end -> expandToDate
      console.log('TML data sample:', expandedTmlData[0]); // Debug: see what properties are available
      const tmlIds = expandedTmlData.map(tml => tml.tmlId || tml.tmlid || tml.id);
      console.log('Extracted TML IDs:', tmlIds);
      console.log('Getting drill-down for TML IDs:', tmlIds.filter(id => id));
      
      // Try to get drill-down data for specific TMLs
      let drillDownData: any[] = [];
      const validTmlIds = tmlIds.filter(id => id);
      
      if (validTmlIds.length > 0) {
        try {
          console.log('Attempting to call specific TML endpoint...');
          drillDownData = await this.getTemporalTrackingForSpecificTmls(endDate, expandToDate, validTmlIds);
          console.log('Specific endpoint succeeded with', drillDownData.length, 'records');
        } catch (error: any) {
          console.log('Specific TML endpoint failed (404), using fallback approach');
          console.log('Error:', error.status, error.statusText);
          
          // Fallback: Get all temporal data for the period and filter to specific TMLs
          console.log('Fetching all temporal data for period:', endDate, 'to', expandToDate);
          const allData = await this.getTemporalTracking(endDate, expandToDate, 999); // High rate to get all
          console.log('Retrieved', allData.length, 'total records for filtering');
          
          drillDownData = allData.filter(record => {
            const recordTmlId = record.tmlId || record.tmlid || record.id;
            const isMatch = validTmlIds.includes(recordTmlId);
            if (isMatch) {
              console.log('Matched TML:', recordTmlId);
            }
            return isMatch;
          });
          console.log('Fallback filtered', drillDownData.length, 'records from', allData.length, 'total records');
        }
      }
      
      console.log('Drill-down data received:', drillDownData.length, 'records');

      if (drillDownData.length > 0) {
        this.generateExpandedSankeyFromData(originalData, drillDownData, startDate, endDate, expandToDate, maxCorrosionRate, expandedNodeData);
      } else {
        console.log('No drill-down data found, keeping original visualization');
      }
    } catch (error) {
      console.error('Error generating expanded Sankey data:', error);
    }
  }

  private async getTemporalTrackingForSpecificTmls(startDate: string, endDate: string, tmlIds: string[]): Promise<any[]> {
    try {
      const params = {
        startDate,
        endDate,
        tmlIds: tmlIds.join(',')
      };
      return await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/temporal/tracking-specific`, { params }));
    } catch (error) {
      console.error('Error loading specific TML tracking data:', error);
      return [];
    }
  }

  private generateExpandedSankeyFromData(
    originalData: any[], 
    drillDownData: any[], 
    startDate: string, 
    endDate: string, 
    expandToDate: string,
    maxCorrosionRate: number,
    expandedNodeData: any
  ): void {
    console.log('Creating focused drill-down Sankey for specific category');

    const endMonth = new Date(endDate).toLocaleString('en-US', { month: 'long' });
    const expandMonth = new Date(expandToDate).toLocaleString('en-US', { month: 'long' });

    // Get the expanded category name (e.g., "20-30 mpy")
    const expandedCategoryName = this.getExpandedCategoryName(expandedNodeData);
    const tmlCount = drillDownData.length;

    // Create NEW 2-column Sankey focused on the clicked category
    const nodes = [
      { name: `${tmlCount} TMLs from ${expandedCategoryName} category (${endMonth})` }
    ];

    // Create links from the focused source to target categories
    const links: any[] = [];
    const expandedFlow = this.categorizeTemporalData(drillDownData);
    
    let targetIndex = 1;
    const categoryNames = ["< 10 mpy", "10-20 mpy", "20-30 mpy", "30-50 mpy", "> 50 mpy"];
    
    // Only add nodes and links for categories that have data
    categoryNames.forEach(category => {
      const items = expandedFlow[category];
      if (items && items.length > 0) {
        // Add target node for this category
        nodes.push({ name: `${category} (${expandMonth})` });
        
        // Create TML data for this category
        const tmlData: { [key: string]: string[] } = {};
        items.forEach(record => {
          const circuitId = record.circuitId || record.circuitid;
          const tmlId = record.tmlId || record.tmlid;
          
          if (!tmlData[circuitId]) {
            tmlData[circuitId] = [];
          }
          tmlData[circuitId].push(tmlId);
        });

        // Sort TML IDs within each circuit
        Object.keys(tmlData).forEach(circuit => {
          tmlData[circuit].sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, ''), 10);
            const numB = parseInt(b.replace(/\D/g, ''), 10);
            return numA - numB;
          });
        });

        links.push({
          source: 0, // From the focused source
          target: targetIndex,
          value: items.length,
          tmls: tmlData,
          tmlData: items
        });
        
        targetIndex++;
      }
    });

    console.log('Created focused Sankey with', nodes.length, 'nodes (only populated categories)');

    const sankeyData: CorrosionData = { nodes, links };
    console.log('=== FOCUSED DRILL-DOWN SANKEY COMPLETE ===');
    console.log('Source:', nodes[0].name);
    console.log('Links:', links.length, 'categories with data');
    this.dataSubject.next(sankeyData);
  }

  private categorizeTemporalData(temporalData: any[]): { [key: string]: any[] } {
    const categoryFlow: { [key: string]: any[] } = {
      "< 10 mpy": [],
      "10-20 mpy": [],
      "20-30 mpy": [],
      "30-50 mpy": [],
      "> 50 mpy": []
    };

    temporalData.forEach(item => {
      // Handle different property name formats from backend
      const rate = parseFloat(item.endCorrosionRate || item.endcorrosionrate);
      
      let category = "> 50 mpy";
      if (rate < 10) category = "< 10 mpy";
      else if (rate < 20) category = "10-20 mpy";
      else if (rate < 30) category = "20-30 mpy";
      else if (rate < 50) category = "30-50 mpy";
      
      categoryFlow[category].push(item);
    });
    return categoryFlow;
  }

  private getExpandedNodeCategoryIndex(nodeData: any): number {
    const nodeName = nodeData.name || '';
    if (nodeName.includes("< 10")) return 0;
    if (nodeName.includes("10-20")) return 1;
    if (nodeName.includes("20-30")) return 2;
    if (nodeName.includes("30-50")) return 3;
    if (nodeName.includes("> 50")) return 4;
    return -1;
  }

  private getExpandedCategoryName(nodeData: any): string {
    const nodeName = nodeData.name || '';
    if (nodeName.includes("< 10")) return "< 10 mpy";
    if (nodeName.includes("10-20")) return "10-20 mpy";
    if (nodeName.includes("20-30")) return "20-30 mpy";
    if (nodeName.includes("30-50")) return "30-50 mpy";
    if (nodeName.includes("> 50")) return "> 50 mpy";
    return "Unknown Category";
  }
}