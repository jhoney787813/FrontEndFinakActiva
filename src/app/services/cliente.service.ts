import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private Url='https://localhost:44367/';
  private ApiUrl='api/Cliente/';

  constructor(private http:HttpClient) {}

    getListClientes(){

      return this.http.get(this.Url+this.ApiUrl);
  
   }

   deleteCliente(identification:number):Observable<any>{
    return this.http.delete(this.Url+this.ApiUrl+identification);
   }

   saveCliente(cliente:any):Observable<any>
   {
    return this.http.post(this.Url+this.ApiUrl,cliente);
   }
   editCliente(identification:number,cliente: any):Observable<any>{

    return  this.http.put(this.Url+this.ApiUrl+identification,cliente);
   }
   InitTiposDocumento(){
    return this.http.get(this.Url+this.ApiUrl+'GetTiposDocumentosInit/');
   }
}
