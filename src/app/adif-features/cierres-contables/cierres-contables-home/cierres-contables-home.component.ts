import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil, distinctUntilChanged, debounceTime, tap } from 'rxjs/internal/operators';
import { CierresContablesServiceService,
        CierresContables,
        ContablesContent } from '../cierres-contables-services/cierres-contables-service.service';
import {CierresDatasource} from '../cierres-contables-services/cierres.datasource';
import { DataTableComponent, PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';

@Component({
  selector: 'adif-cierres-contables-home',
  templateUrl: './cierres-contables-home.component.html',
  styleUrls: ['./cierres-contables-home.component.scss']
})
export class CierresContablesHomeComponent implements OnInit, OnDestroy {
  private readonly debounceTimeInMillis = 300;
  paginationIndex = false;
  notificationMsg: string;
  private unsubscribe = new Subject();
  datalength: number;
  cierresSearch;
  cierresSearchForm: FormGroup;
  @ViewChild(DataTableComponent) dataTab: DataTableComponent;
  dataSourceSelected = false;
  dataTableSource: Observable<CierresContables[]>;
  dataSource: CierresDatasource;
  loading = false;
  columnsToDisplay = ['radio', 'periodo_certificacion', 'fecha_cierre'];
  columnsParams = {periodo_certificacion: 'Periodo Certificacion', fecha_cierre: 'Fecha Cierre'};
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contablesServiceService: CierresContablesServiceService
  ) {
    this.cierresSearchForm = formBuilder.group({
      cierresSearch: ''
    });
    this.cierresSearch = this.cierresSearchForm.get('cierresSearch');
    this.cierresSearch.valueChanges
    .pipe(
      takeUntil(this.unsubscribe),
      debounceTime(this.debounceTimeInMillis),
      distinctUntilChanged(),
      tap(searchData => {
        if (searchData) {
          this.dataSource.loadCirresData([]);
          this.loading = true;
          setTimeout(() => {
            this.dataTab.paginator.firstPage();
            this.dataSource.loadCirresData(ELEMENT_DATA);
            this.datalength = 8;
            this.loading = false;
          });
        } else {
          this.resetTabbleGrid();
        }
      })
    )
    .subscribe();
  }

  ngOnInit() {
    this.dataSource = new CierresDatasource();
    const page: PageQuery = {
      pageIndex: 0, pageSize: 5
    };
    this.contablesServiceService.findAll(page)
        .subscribe((data: ContablesContent) => {
          this.dataSource.loadCirresData(data.content);
          this.datalength = data.totalElements;
        });
    this.dataTableSource = this.dataSource.getCirresData();
  }

  resetTabbleGrid() {
    this.loading = true;
    const page: PageQuery = {
      pageIndex: 0, pageSize: 5
    };
    this.contablesServiceService.findAll(page)
        .subscribe((data: ContablesContent) => {
          this.dataTab.paginator.firstPage();
          this.dataSource.loadCirresData(data.content);
          this.datalength = data.totalElements;
          this.loading = false;
        });
    this.dataTableSource = this.dataSource.getCirresData();
  }

  edit() {
    if (this.dataTab) {
      const rowData: CierresContables = this.dataTab.selectedRow;
      this.contablesServiceService.userSelectedRow(rowData);
      this.router.navigate(['cierres-contable-edit', rowData.id], { relativeTo: this.route });
    }
  }

  delete() {
    if (this.dataTab) {
      const rowData: CierresContables = this.dataTab.selectedRow;
    }
  }

  eventCaptured(event: boolean) {
    if (event) {
      this.dataSourceSelected = true;
    }
  }

  requestPage(pageQuery: PageQuery) {
    this.loading = true;
    if (!this.cierresSearch.value) {
      this.contablesServiceService.findAll(pageQuery)
      .subscribe((data: ContablesContent) => {
        this.dataSource.loadCirresData(data.content);
        this.loading = false;
      });
    } else {
      if (pageQuery.pageIndex > 0) {
        this.dataSource.loadCirresData(ELEMENT_DATA1);
        this.loading = false;
      } else {
        this.dataSource.loadCirresData(ELEMENT_DATA3);
        this.loading = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

const ELEMENT_DATA: CierresContables[] = [
  {
    id: 13,
    periodo_certificacion: '16/07/2020',
    fecha_cierre: '16/07/2019'
  }, {
    id: 23,
    periodo_certificacion: '14/07/2020',
    fecha_cierre: '18/07/2019'
  }, {
    id: 35,
    periodo_certificacion: '16/07/2020',
    fecha_cierre: '13/05/2019'
  }, {
    id: 45,
    periodo_certificacion: '16/07/2020',
    fecha_cierre: '16/06/2019'
  },
];

const ELEMENT_DATA1: CierresContables[] = [
  {
    id: 14,
    periodo_certificacion: '20/07/2020',
    fecha_cierre: '20/07/2019'
  }, {
    id: 23,
    periodo_certificacion: '21/07/2020',
    fecha_cierre: '21/07/2019'
  }
];

const ELEMENT_DATA3: CierresContables[] = [
  {
    id: 13,
    periodo_certificacion: '5/08/2016',
    fecha_cierre: '17/07/2019'
  }, {
    id: 23,
    periodo_certificacion: '14/07/2020',
    fecha_cierre: '18/07/2019'
  }, {
    id: 35,
    periodo_certificacion: '16/07/2020',
    fecha_cierre: '13/05/2019'
  }, {
    id: 45,
    periodo_certificacion: '16/07/2020',
    fecha_cierre: '16/06/2019'
  },
];
