import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { NotificationImplService } from '../../../services/notification.service';
import { getErrorMessage, orderStatusColorsText, orderStatusText } from '../../../services/functions.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { dateRangeValidator } from '../../../services/functions.service';
import { MatCardModule } from '@angular/material/card';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [SharedModule,MatCardModule, MatExpansionModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export default class ReportComponent {
  dateStart = "";
  dateEnd = "";
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  }, { validators: dateRangeValidator });
  reports: any = []
  reportsTotal: any = {}
  resume:any=[]
  public notificationService = inject(NotificationImplService);
  selectedTabIndex: number = 0;
  constructor(private report: ReportService) {

  }
  async ngOnInit() {
    
    this.range.valueChanges.subscribe((value) => {
      this.applyFilter();
      console.log(value);
    })
  }
  async applyFilter() {
    try {
      if (this.range.value.start && this.range.value.end && this.selectedTabIndex == 0) {

        const filter = { from: this.formatDate(this.range.value.start), to: this.formatDate(this.range.value.end) };

        const result = await this.report.getTopTen(filter);
        if (result.success) {
          this.reports = result.data;
        } else {
          this.notificationService.errorNotification('Error en la solicitud');
        }

        const resultTotals = await this.report.getTotalPerStatus(filter);
        if (resultTotals.success) {
          this.reportsTotal = resultTotals.data;
        } else {
          this.notificationService.errorNotification('Error en la solicitud');
        }

        const resultResume = await this.report.resumeOrder(filter);
        if (resultResume.success) {
          this.resume = resultResume.data;
        } else {
          this.notificationService.errorNotification('Error en la solicitud');
        }
      }

    } catch (error) {
      const message = getErrorMessage(error)
      this.notificationService.errorNotification(message)
    }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
    console.log('Pestaña seleccionada:', this.selectedTabIndex);
  }
  getOrderStatusColor(status: string): string {
    return orderStatusColorsText[status] || '#000000'; // Negro por defecto si no se encuentra el estado
  }
  getOrderStatusText(status: string): string {
    return orderStatusText[status] || 'Sin estado'; //
  }
}
