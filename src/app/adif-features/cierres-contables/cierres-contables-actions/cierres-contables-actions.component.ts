import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../shared/dateAdapter/date.adapter';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AdifValidators } from '../../../shared/validation/adif-validators';
import { takeUntil, distinctUntilChanged } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/internal/Subject';
import { CierresContablesServiceService, CierresContables } from '../cierres-contables-services/cierres-contables-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../shared/notification/notification.service';

@Component({
  selector: 'adif-cierres-contables-actions',
  templateUrl: './cierres-contables-actions.component.html',
  styleUrls: ['./cierres-contables-actions.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class CierresContablesActionsComponent implements OnInit {
  minDate = new Date();
  description: string;
  private unsubscribe = new Subject();
  params = Object.keys(this.route.snapshot.params).length;
  cierresContablesManagement: FormGroup;
  periodoCertificacionControl;
  fechaCierreControl;
  private notificationMsg = {
    success : { action: 'success', msg: 'creado con éxito Cierres' },
    update : { action: 'success', msg: 'actualizado exitosamente' },
    error: { action: 'error', msg: 'el registro ya existe' },
    delete : { action: 'success', msg: 'borrado exitosamente' },
    sorryForIncovinience: { action: 'error', msg: 'lo siento por incoviencia' },
  };
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cierresContablesServiceService: CierresContablesServiceService,
    private notificationService: NotificationService,
  ) {
    this.cierresContablesManagement = this.formBuilder.group({
      periodo_certificacion: ['', Validators.required],
      fecha_cierre: ['', Validators.required]
    });
    this.periodoCertificacionControl = this.cierresContablesManagement.get('periodo_certificacion');
    this.fechaCierreControl = this.cierresContablesManagement.get('fecha_cierre');
    this.periodoCertificacionControl.valueChanges
    .pipe(
      takeUntil(this.unsubscribe),
      distinctUntilChanged()
    )
    .subscribe(currentDate => {
      this.set40DaysOnSelectedDate(currentDate);
    });
   }

  ngOnInit() {
    this.description = this.route.snapshot.data['desc'];
    if (this.params) {
      const data: CierresContables = this.cierresContablesServiceService.getUserSelection();
      if (data) {
        this.cierresContablesManagement.setValue({
          periodo_certificacion: this.dateFormat(data.periodo_certificacion),
          fecha_cierre: this.dateFormat(data.fecha_cierre)
        });
        this.periodoCertificacionControl.disable();
      }
    }
  }

  dateFormat(value: string): any {
    const date = value.split('/');
    return new Date(date[1] + '/' + date[0] + '/' + date[2]);
  }

  private set40DaysOnSelectedDate(selectedDate) {
    if (selectedDate && selectedDate.getTime()) {
      const timestamp = selectedDate.getTime() + (40 * 24 * 60 * 60 * 1000);
      const newDate = new Date(timestamp);
      this.fechaCierreControl.setValue(newDate);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.cierresContablesManagement.controls[controlName].hasError(errorName);
  }

  cierresContablesManagementSubmit() {
    if (this.cierresContablesManagement.valid) {
      const cierresData: CierresContables = this.cierresContablesManagement.getRawValue();
      if (this.params) {
        this.cierresContablesServiceService.update({
          periodo_certificacion: moment(cierresData.periodo_certificacion).format('DD/MM/YYYY'),
          fecha_cierre: moment(cierresData.fecha_cierre).format('DD/MM/YYYY')
        }).subscribe(data => {
          this.notificationService.setNotification(this.notificationMsg.update);
          this.router.navigate(['/cierres-contables']);
        }, (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.notificationService.setNotification(this.notificationMsg.error);
            this.router.navigate(['/cierres-contables']);
          } else {
            this.notificationService.setNotification(this.notificationMsg.sorryForIncovinience);
            this.router.navigate(['/cierres-contables']);
          }
        });
      } else {
        this.cierresContablesServiceService.add({
          periodo_certificacion: moment(cierresData.periodo_certificacion).format('DD/MM/YYYY'),
          fecha_cierre: moment(cierresData.fecha_cierre).format('DD/MM/YYYY')
        }).subscribe(data => {
          this.notificationService.setNotification(this.notificationMsg.success);
          this.router.navigate(['/cierres-contables']);
        }, (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.notificationService.setNotification(this.notificationMsg.error);
            this.router.navigate(['/cierres-contables']);
          } else {
            this.notificationService.setNotification(this.notificationMsg.sorryForIncovinience);
            this.router.navigate(['/cierres-contables']);
          }
        });
      }
    }
  }

}
