import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  public io_host = 'aneeshkumarbhola.com';
  public io_port = '3001';
  public io_namespace = 'test';
  public io_url = 'https://'+this.io_host+':'+this.io_port+'/'+this.io_namespace;

  constructor() { }
}
