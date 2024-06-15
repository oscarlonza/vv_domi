import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { NotificationImplService } from '../../../services/notification.service';
import { getErrorMessage,orderStatusColorsText } from '../../../services/functions.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { dateRangeValidator } from '../../../services/functions.service';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export default class ReportComponent {
  dateStart = "";
  dateEnd = "";
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  },{ validators: dateRangeValidator });
  range2 = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  },{ validators: dateRangeValidator });
  reports: any = []
  reportsTotal: any = {}
  public notificationService = inject(NotificationImplService);
  selectedTabIndex: number = 0;
  constructor(private report: ReportService) {

  }
  async ngOnInit() {
    //await this.loadInitialDates();
    this.range.valueChanges.subscribe((value) => {
      this.applyFilter();
      console.log(value);
    })
    this.range2.valueChanges.subscribe((value) => {
      this.applyFilter();
      console.log(value);
    })
  }
  async applyFilter() {
    console.log('okkkkkkkkk');
    try {
      if (this.range.value.start && this.range.value.end && this.selectedTabIndex == 0) {
          const result = await this.report.getTopTen({ from: this.formatDate(this.range.value.start), to: this.formatDate(this.range.value.end) });
          if (result.success) {
            this.reports = result.data;
          } else {
            this.notificationService.errorNotification('Error en la solicitud');
          }
      }else if (this.range2.value.start && this.range2.value.end && this.selectedTabIndex == 1){
          const result = await this.report.getTotalPerStatus({ from: this.formatDate(this.range2.value.start), to: this.formatDate(this.range2.value.end) });
          if (result.success) {
            this.reportsTotal = result.data;
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

}
