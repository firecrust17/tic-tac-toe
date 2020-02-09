import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

	new = '';
	join = '';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  start(value) {
  	this.router.navigate(['/game/'+value]);
  }

}
