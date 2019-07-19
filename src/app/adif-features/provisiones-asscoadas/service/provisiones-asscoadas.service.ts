import { Injectable } from '@angular/core';
import { CierresContables, ContablesContent } from '../../cierres-contables/cierres-contables-services/cierres-contables-service.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';

@Injectable({
  providedIn: 'root'
})
export class ProvisionesAsscoadasService {
  userSelection: CierresContables;
  private readonly allActionsUri = '/adif/contables';
  constructor(
    private http: HttpClient
  ) { }

  userSelectedRow(row) {
    this.userSelection = row;
  }

  getUserSelection() {
    return this.userSelection;
  }

  findAll(pageQuery: PageQuery): Observable<ContablesContent> {
    return this.http.get<ContablesContent>(this.allActionsUri + '/' + pageQuery.pageIndex + '/' + pageQuery.pageSize);
  }
}
