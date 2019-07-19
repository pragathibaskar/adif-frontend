import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs/internal/observable/of';
import { AdifValidators } from '../../../shared/validation/adif-validators';
import { ProvisionesAsscoadasService } from '../service/provisiones-asscoadas.service';
import { CierresContables, ContablesContent } from '../../cierres-contables/cierres-contables-services/cierres-contables-service.service';
import { map } from 'rxjs/internal/operators/map';
import { PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';
import { ActivatedRoute } from '@angular/router';

function controlValueIsLocationSelected(value: any) {
  return value && typeof value !== 'string';
}

export interface ProvisionesDate {
  date: string;
  value: string;
}

@Component({
  selector: 'adif-provisiones-asscoadas-actions',
  templateUrl: './provisiones-asscoadas-actions.component.html',
  styleUrls: ['./provisiones-asscoadas-actions.component.scss']
})
export class ProvisionesAsscoadasActionsComponent implements OnInit {
  description: string;
  provisionesActionForm: FormGroup;
  provisiones;
  fierra;
  private readonly debounceTimeInMillis = 300;
  private readonly maxNumberOfResults = 3;

  matchingContables$: Observable<any[]>;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private provisionesAsscoadasService: ProvisionesAsscoadasService
  ) {
    this.provisionesActionForm = formBuilder.group({
      provisiones: ['', [Validators.required, AdifValidators.forbiddenValue]],
      fierra: ''
    });
    this.provisiones = this.provisionesActionForm.get('provisiones');
    this.fierra = this.provisionesActionForm.get('fierra');
    this.matchingContables$ = this.provisiones.valueChanges.pipe(
      startWith(''),
      debounceTime(this.debounceTimeInMillis),
      distinctUntilChanged(),
      switchMap((value: any) => controlValueIsLocationSelected(value) ? of([value]) : this.searchFn(value as string))
    );
   }

  ngOnInit() {
    this.description = this.route.snapshot.data['desc'];
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.provisionesActionForm.controls[controlName].hasError(errorName);
  }

  searchFn(term: string): Observable<CierresContables[]> {
    const page: PageQuery = {
      pageIndex: 0, pageSize: 10
    };
    return this.provisionesAsscoadasService.findAll(page)
      .pipe(map((values: ContablesContent) => {
        if (values.content) {
        return term ? values.content.filter(val => val.periodo_certificacion.includes(term))
              : this.getDefaultProvisionesData<CierresContables>(values.content);
        }
        return [];
      }
    ));
  }

  displayFn = (provisionesDate: CierresContables) => {
    let displayedProvisiones = '';
    if (provisionesDate && provisionesDate.periodo_certificacion) {
      displayedProvisiones = provisionesDate.periodo_certificacion;
    }
    return displayedProvisiones;
  }

  contableFn(contableData: CierresContables) {
    this.fierra.setValue(contableData.fecha_cierre);
  }

  private getDefaultProvisionesData<T>(provisionesData: T[]): T[] {
    return provisionesData.slice(0, Math.min(provisionesData.length, this.maxNumberOfResults));
  }

}
