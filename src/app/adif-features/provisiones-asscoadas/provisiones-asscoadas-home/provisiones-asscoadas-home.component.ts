import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil, distinctUntilChanged, debounceTime, tap } from 'rxjs/internal/operators';
import { ProvisionesDatasource } from '../service/provisiones.datasource';
import { ProvisionesAsscoadasService } from '../service/provisiones-asscoadas.service';
import { CierresContables, ContablesContent } from '../../cierres-contables/cierres-contables-services/cierres-contables-service.service';
import { DataTableComponent, PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';

@Component({
  selector: 'adif-provisiones-asscoadas-home',
  templateUrl: './provisiones-asscoadas-home.component.html',
  styleUrls: ['./provisiones-asscoadas-home.component.scss']
})
export class ProvisionesAsscoadasHomeComponent implements OnInit {
  private readonly debounceTimeInMillis = 300;
  private unsubscribe = new Subject();
  datalength: number;
  cierresSearch;
  provisionesSearchForm: FormGroup;
  @ViewChild(DataTableComponent) dataTab: DataTableComponent;
  dataTableSource: Observable<CierresContables[]>;
  dataSource: ProvisionesDatasource;
  loading = false;
  columnsToDisplay = ['radio', 'periodo_certificacion', 'fecha_cierre'];
  columnsParams = {periodo_certificacion: 'Periodo Certificacion', fecha_cierre: 'Fecha Cierre'};
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private provisionesAsscoadasService: ProvisionesAsscoadasService
  ) {
    this.provisionesSearchForm = formBuilder.group({
      provisionesSearch: ''
    });
    this.cierresSearch = this.provisionesSearchForm.get('provisionesSearch');
    this.cierresSearch.valueChanges
    .pipe(
      takeUntil(this.unsubscribe),
      debounceTime(this.debounceTimeInMillis),
      distinctUntilChanged(),
      tap(searchData => {
        this.loading = true;
        // this.dataSource.searchProvisionesData(ELEMENT_DATA);
        this.loading = false;
      })
    )
    .subscribe();
  }

  ngOnInit() {
    this.dataSource = new ProvisionesDatasource();
    const page: PageQuery = {
      pageIndex: 0, pageSize: 5
    };
    this.provisionesAsscoadasService.findAll(page)
        .subscribe((data: ContablesContent) => {
          this.dataSource.loadProvisionesData(data.content);
          this.datalength = data.totalElements;
        });
    this.dataTableSource = this.dataSource.getProvisionesData();
  }

  requestPage(pageQuery: PageQuery) {
    this.loading = true;
    this.provisionesAsscoadasService.findAll(pageQuery)
        .subscribe((data: ContablesContent) => {
          this.dataSource.loadProvisionesData(data.content);
          this.loading = false;
        });
  }
}

// const ELEMENT_DATA: CierresContables[] = [
//   {
//     id: 13,
//     periodoCertificacion: '16/07/2020',
//     fechaCierre: '16/07/2019'
//   }, {
//     id: 23,
//     periodoCertificacion: '14/07/2020',
//     fechaCierre: '18/07/2019'
//   }, {
//     id: 35,
//     periodoCertificacion: '16/07/2020',
//     fechaCierre: '13/05/2019'
//   }, {
//     id: 45,
//     periodoCertificacion: '16/07/2020',
//     fechaCierre: '16/06/2019'
//   }
// ];
