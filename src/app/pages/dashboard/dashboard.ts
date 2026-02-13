import { Component, inject, signal, computed, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AllServices } from '../service/all-services';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, NgbPagination],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statusChartContainer') statusChartContainer!: ElementRef;
  @ViewChild('categoryChartContainer') categoryChartContainer!: ElementRef;

  private service = inject(AllServices);
  private router = inject(Router);
  private statusChartRoot: am5.Root | null = null;
  private categoryChartRoot: am5.Root | null = null;

  // Signals for data
  enquiries = signal<any[]>([]);
  categories = signal<any[]>([]);
  statuses = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string>('');

  // Pagination
  page = 1;
  pageSize = 10;
  totalRecords = 0;

  // Search & Filter
  searchTerm = '';
  statusFilter = 'all';
  categoryFilter = 'all';

  // Chart data - plain arrays for template
  statusChartData: any[] = [];
  categoryChartData: any[] = [];

  // Chart colors
  chartColors = ['#667eea', '#f6ad55', '#48bb78', '#ed8936', '#e53e3e', '#9f7aea', '#38b2ac'];

  // Computed values for filtered data
  filteredEnquiries = computed(() => {
    const search = this.searchTerm.toLowerCase().trim();
    const status = this.statusFilter;
    const category = this.categoryFilter;
    const data = this.enquiries();

    let filtered = data;

    if (search) {
      filtered = filtered.filter(item =>
        item.enquiryNo?.toLowerCase().includes(search) ||
        item.customerName?.toLowerCase().includes(search) ||
        item.customerEmail?.toLowerCase().includes(search) ||
        item.customerPhone?.includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(item => item.statusName === status);
    }

    if (category !== 'all') {
      filtered = filtered.filter(item => item.categoryName === category);
    }

    return filtered;
  });

  totalEnquiries = computed(() => this.enquiries().length);
  
  pendingEnquiries = computed(() => {
    const pending = this.enquiries().filter(e => 
      e.statusName?.toLowerCase() === 'pending' || e.statusId === 1
    );
    return pending.length;
  });

  inProgressEnquiries = computed(() => {
    const progress = this.enquiries().filter(e => 
      e.statusName?.toLowerCase() === 'in progress' || 
      e.statusName?.toLowerCase() === 'inprogress' || 
      e.statusId === 2
    );
    return progress.length;
  });

  completedEnquiries = computed(() => {
    const completed = this.enquiries().filter(e => 
      e.statusName?.toLowerCase() === 'completed' || e.statusId === 3
    );
    return completed.length;
  });

  // Helper methods for charts
  getStatusPercentageValue(index: number): number {
    if (this.statusChartData.length === 0) return 0;
    const total = this.statusChartData.reduce((sum, item) => sum + item.value, 0);
    const item = this.statusChartData[index];
    if (!item || total === 0) return 0;
    return (item.value / total) * 100;
  }

  getStatusOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.getStatusPercentageValue(i);
    }
    return offset;
  }

  getChartColor(index: number): string {
    return this.chartColors[index % this.chartColors.length];
  }

  getBarPercentage(value: number): number {
    if (this.categoryChartData.length === 0) return 0;
    const max = Math.max(...this.categoryChartData.map(d => d.value));
    if (max === 0) return 0;
    return (value / max) * 100;
  }

  // Get status percentage
  getStatusPercentage(status: string): number {
    const total = this.totalEnquiries() || 1;
    if (status === 'pending') return (this.pendingEnquiries() / total) * 100;
    if (status === 'inprogress') return (this.inProgressEnquiries() / total) * 100;
    if (status === 'completed') return (this.completedEnquiries() / total) * 100;
    if (status === 'total') return 100;
    return 0;
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.statusChartRoot) {
      this.statusChartRoot.dispose();
    }
    if (this.categoryChartRoot) {
      this.categoryChartRoot.dispose();
    }
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.error.set('');

    this.service.getEnquiries(this.page, this.pageSize).subscribe({
      next: (res: any) => {
        const data = res?.data || [];
        this.enquiries.set(data);
        this.totalRecords = res?.totalRecords || data.length || 0;
        this.prepareChartData();
        this.isLoading.set(false);
        
        setTimeout(() => {
          this.createStatusPieChart();
          this.createCategoryBarChart();
        }, 200);
      },
      error: (err: any) => {
        console.error('Error loading enquiries:', err);
        this.error.set('Failed to load enquiries');
        this.isLoading.set(false);
        this.enquiries.set([]);
      }
    });

    this.service.getAllCategory().subscribe({
      next: (res: any) => {
        this.categories.set(res?.data || []);
      },
      error: () => {
        this.categories.set([]);
      }
    });

    this.service.getAllStatus().subscribe({
      next: (res: any) => {
        this.statuses.set(res?.data || []);
      },
      error: () => {
        this.statuses.set([]);
      }
    });
  }

  prepareChartData() {
    const data = this.enquiries();
    
    const statusCounts: { [key: string]: number } = {};
    data.forEach((item: any) => {
      const status = item.statusName || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    this.statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));

    const categoryCounts: { [key: string]: number } = {};
    data.forEach((item: any) => {
      const category = item.categoryName || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    this.categoryChartData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  }

  createStatusPieChart() {
    if (!this.statusChartContainer || this.statusChartData.length === 0) return;

    if (this.statusChartRoot) {
      this.statusChartRoot.dispose();
    }

    const root = am5.Root.new(this.statusChartContainer.nativeElement);
    this.statusChartRoot = root;

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(85),
        innerRadius: am5.percent(55)
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'name',
        radius: am5.percent(85),
        innerRadius: am5.percent(55)
      })
    );

    series.set('colors', am5.ColorSet.new(root, {
      colors: this.chartColors.map(c => am5.color(parseInt(c.replace('#', ''), 16)))
    }));

    series.data.setAll(this.statusChartData);

    series.labels.template.setAll({ forceHidden: true });
    series.ticks.template.setAll({ forceHidden: true });

    const legend = chart.children.push(
      am5.Legend.new(root, {
        x: am5.p100,
        y: am5.p0,
        centerY: am5.p0,
        marginLeft: 15,
        marginTop: 10
      })
    );

    legend.data.setAll(series.dataItems);
    legend.labels.template.setAll({
      fontSize: 11,
      fontWeight: '500'
    });
  }

  createCategoryBarChart() {
    if (!this.categoryChartContainer || this.categoryChartData.length === 0) return;

    if (this.categoryChartRoot) {
      this.categoryChartRoot.dispose();
    }

    const root = am5.Root.new(this.categoryChartContainer.nativeElement);
    this.categoryChartRoot = root;

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'name',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 5 })
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    xAxis.data.setAll(this.categoryChartData);

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Enquiries',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'name',
        fill: am5.color(parseInt(this.chartColors[0].replace('#', ''), 16)),
        stroke: am5.color(parseInt(this.chartColors[0].replace('#', ''), 16))
      })
    );

    series.data.setAll(this.categoryChartData);
    series.columns.template.setAll({ width: am5.percent(60) });

    series.bullets.push(function(this: any) {
      return am5.Bullet.new(this.root, {
        sprite: am5.Label.new(this.root, {
          text: '{valueY}',
          fontSize: 11,
          fontWeight: '600',
          fill: am5.color(0xffffff),
          y: am5.percent(50),
          dy: -8
        })
      });
    });

    xAxis.get('renderer').grid.template.setAll({ visible: false });
    yAxis.get('renderer').grid.template.setAll({ visible: false });
    xAxis.get('renderer').labels.template.setAll({ fontSize: 10, fontWeight: '500' });
    yAxis.get('renderer').labels.template.setAll({ fontSize: 10, fontWeight: '500' });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadDashboardData();
  }

  getPageStart(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  getPageEnd(): number {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.categoryFilter = 'all';
  }

  viewEnquiryDetails(enquiry: any) {
    this.router.navigate(['/enquirydetails'], { queryParams: { id: enquiry.enquiryId } });
  }

  navigateToSubmitEnquiry() {
    this.router.navigate(['/submitenquiry']);
  }

  getStatusColor(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'pending') return 'warning';
    if (s === 'completed') return 'success';
    if (s === 'in progress' || s === 'inprogress') return 'info';
    if (s === 'cancelled' || s === 'rejected') return 'danger';
    return 'secondary';
  }

  getStatusIcon(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'pending') return 'fa-clock';
    if (s === 'completed') return 'fa-check-circle';
    if (s === 'in progress' || s === 'inprogress') return 'fa-spinner fa-spin';
    return 'fa-flag';
  }
}
