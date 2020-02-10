import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

	game_id = '';
	is_new = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  start(value) {
  	if(this.is_new){
  		// check if room exists
  		this.router.navigate(['/game/'+value]);
  	} else {
  		this.router.navigate(['/game/'+value]);
  	}
  }

}
