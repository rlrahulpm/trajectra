import { Component, OnInit, OnDestroy, OnChanges, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { CorrosionData, SankeyLink, TmlData } from '../../models/corrosion-data.interface';
import { CorrosionDataService } from '../../services/corrosion-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sankey-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <svg #sankeyChart 
           width="702" 
           height="390" 
           style="max-width: 100%; display: block; margin: 0 auto;">
      </svg>
    </div>
  `
})
export class SankeyChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('sankeyChart', { static: true }) sankeyChart!: ElementRef<SVGElement>;
  @Input() data: CorrosionData | null = null;
  @Output() linkClick = new EventEmitter<TmlData>();

  private width = 702;
  private height = 390;
  private svg: any;
  private sankeyGenerator: any;
  private dataSubscription: Subscription | null = null;

  constructor(private corrosionDataService: CorrosionDataService) {}

  ngOnInit(): void {
    console.log('SankeyChart ngOnInit');
    this.initializeChart();
    
    // Test with hardcoded data first
    const testData: CorrosionData = {
      nodes: [
        { name: "Test Source" },
        { name: "Test Target 1" },
        { name: "Test Target 2" }
      ],
      links: [
        { source: 0, target: 1, value: 10 },
        { source: 0, target: 2, value: 20 }
      ]
    };
    
    console.log('Testing with hardcoded data:', testData);
    this.updateChart(testData);
    
    // Subscribe directly to the service data
    this.dataSubscription = this.corrosionDataService.data$.subscribe(data => {
      console.log('SankeyChart received data from service:', data);
      if (data && data.links && data.links.length > 0) {
        console.log('Updating chart with service data');
        this.updateChart(data);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  ngOnChanges(): void {
    console.log('Sankey chart ngOnChanges called with data:', this.data);
    if (this.data && this.svg) {
      this.updateChart(this.data);
    }
  }

  private initializeChart(): void {
    this.svg = d3.select(this.sankeyChart.nativeElement)
      .append("g");

    this.sankeyGenerator = sankey()
      .nodeWidth(20)
      .nodePadding(30)
      .extent([[1, 1], [this.width - 1, this.height - 6]]);
  }

  private updateChart(data: CorrosionData): void {
    console.log('updateChart called with:', data);
    if (!this.svg || !data) {
      console.log('No svg or data:', { svg: !!this.svg, data: !!data });
      return;
    }

    if (!data.nodes || !data.links || data.links.length === 0) {
      console.log('No nodes or links in data');
      return;
    }

    // Clear previous chart
    this.svg.selectAll("*").remove();

    // Create a copy of the data for d3 processing
    const graph = this.sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    });
    
    console.log('Generated graph:', graph);

    // Create links
    this.svg.append("g")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .attr("stroke", (d: any) => this.getLinkColor(d.target.name))
      .style("cursor", "pointer")
      .on("click", (event: any, d: SankeyLink) => {
        if (d.tmls) {
          this.linkClick.emit(d.tmls);
        }
      });

    // Create nodes
    const node = this.svg.append("g")
      .selectAll("g")
      .data(graph.nodes)
      .join("g")
      .attr("class", "node");

    // Add rectangles for nodes
    node.append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("fill", (d: any) => this.getNodeColor(d.name));

    // Add text labels for nodes
    node.append("text")
      .attr("x", (d: any) => d.x0 < this.width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", (d: any) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => d.x0 < this.width / 2 ? "start" : "end")
      .text((d: any) => d.index === 0 ? d.name : d.name + (d.value ? ` (${d.value})` : ""));
  }

  private getLinkColor(targetName: string): string {
    if (targetName.includes("< 10")) return "#22C55E";
    if (targetName.includes("10-20")) return "#FACC15";
    if (targetName.includes("20-30")) return "#F97316";
    if (targetName.includes("30-50")) return "#EF4444";
    if (targetName.includes("> 50")) return "#DC2626";
    return "#ccc";
  }

  private getNodeColor(nodeName: string): string {
    if (nodeName.includes("< 10")) return "#22C55E";
    if (nodeName.includes("10-20")) return "#FACC15";
    if (nodeName.includes("20-30")) return "#F97316";
    if (nodeName.includes("30-50")) return "#EF4444";
    if (nodeName.includes("> 50")) return "#DC2626";
    return "#6366F1";
  }
}