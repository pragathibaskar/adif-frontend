import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Notify } from '../../../shared/notification/notification/notification.component';
import { PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';

export interface CierresContables {
  id?: number;
  periodo_certificacion: string;
  fecha_cierre: string;
}

export interface ContablesContent {
  content: CierresContables[];
  numberOfElements: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class CierresContablesServiceService {
  private readonly allActionsUri = '/adif/contables';
  userSelection: CierresContables;
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

  update(data: CierresContables): Observable<CierresContables> {
    return this.http.put<CierresContables>(this.allActionsUri, {
      periodo_certificacion: data.periodo_certificacion,
      fecha_cierre: data.fecha_cierre
    });
  }

  add(data: CierresContables): Observable<CierresContables> {
    return this.http.post<CierresContables>(this.allActionsUri, {
      periodo_certificacion: data.periodo_certificacion,
      fecha_cierre: data.fecha_cierre
    });
  }

  delete(data: CierresContables) {
    return this.http.delete(this.allActionsUri);
  }

  searchWithDate(data: string): Observable<ContablesContent> {
    return this.http.get<ContablesContent>(this.allActionsUri + '/' + data);
  }

}
