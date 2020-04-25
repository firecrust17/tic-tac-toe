import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { EnvService } from '../../services/env.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

	game_id;
	user_no = null;
	user_one_starts = true;
	user_one_turn = true;
	cells_clicked = 0;
	winner = 0;
	game_over = false;
	winner_text = '';
	total_users = 0;
	win_map = [
		[[0,0], [0,1], [0,2]],
		[[1,0], [1,1], [1,2]],
		[[2,0], [2,1], [2,2]],
		[[0,0], [1,0], [2,0]],
		[[0,1], [1,1], [2,1]],
		[[0,2], [1,2], [2,2]],
		[[0,0], [1,1], [2,2]],
		[[0,2], [1,1], [2,0]],
	];

	game = [[0,0,0],[0,0,0],[0,0,0]];

  constructor(
  	private socket: SocketService,
		private env: EnvService,
		private act_route: ActivatedRoute,
		private router: Router,
  ) {
  	this.act_route.params.subscribe(params => {
      this.game_id = params.game_id;

      this.socket.initiate_connection({"room": this.game_id, "user_name": "Aneesh"});
      this.socket.socket_event('join_room', this.game_id);
    });
  }

  ngOnInit() {
  	
    this.socket.get_data_all().subscribe(res => {
      // console.log(res);
      this.process_response(res);
    });

  }

  process_response(res) {
    switch(res.event_type) {
      case 'join_room':
      	this.total_users = res.count;
        // console.log(res.count + " users connected to this room");
        if(!this.user_no){
        	this.user_no = res.count;
        }
      break;
      case 'data_in_all':
        this.process_data_out_all(res.data);
      break;
      default:
      break;
    }
  }

  process_data_out_all(data) {
    switch(data.type) {
      case 'clicked':
      	this.game[data.row][data.col] = data.user_no;
      	this.user_one_turn =! this.user_one_turn;
      	this.cells_clicked += 1;
      	this.check_if_game_over();
      break;
      case 'game_over':
      	// console.log(data.winner_text);
      	if(this.user_no < 3 && data.winner != this.user_no && data.winner != 0){
      		this.winner_text = 'You Lose :(';
      	} else if (this.user_no < 3 && data.winner == this.user_no && data.winner != 0) {
      		this.winner_text = 'You Win!! :D';
      	} else {
      		this.winner_text = data.winner_text;
      	}
      	this.add_highlight(data.win_map_index);
      	this.game_over = true;
      break;
      case 'restart':
      	this.game_over = false;
      	this.cells_clicked = 0;
      	this.game = [[0,0,0],[0,0,0],[0,0,0]];
		  	this.user_one_starts = !this.user_one_starts;
		  	this.user_one_turn = this.user_one_starts;
		  	this.remove_highlight();
      break;

    }
  }

  cell_clicked(row, col) {
  	if(this.game_over) {
  		return false;
  	}
  	if(this.user_no == 1 || this.user_no == 2){
  		if(this.game[row][col] == 0){

	  		if((this.user_no == 1 && this.user_one_turn) || (this.user_no == 2 && !this.user_one_turn)){
	  			this.socket.socket_event('data_in_all', this.game_id, {"type": "clicked", "row": row, "col": col, "user_no": this.user_no});
	  			this.game[row][col] = this.user_no;
	  			// this.check_if_game_over();
	  		} else {
	  			console.log("not your turn");
	  		}

  		} else {
  			console.log("invalid move");
  		}

  	} else {
  		alert("You can only watch the game");
  	}
  }

  check_if_game_over() {
  	var win_map = this.win_map;
  	for(var i=0; i<win_map.length; i++) {
  		if((this.game[win_map[i][0][0]][win_map[i][0][1]] == this.game[win_map[i][1][0]][win_map[i][1][1]]) && 
  			(this.game[win_map[i][1][0]][win_map[i][1][1]] == this.game[win_map[i][2][0]][win_map[i][2][1]])){
  			this.winner = this.game[win_map[i][0][0]][win_map[i][0][1]];
  			if(this.winner){
  				this.socket.socket_event('data_in_all', this.game_id, {"type": "game_over", 
  				"winner_text": "User "+this.winner+" won the game.", "winner": this.winner, "win_map_index": i});
  				return;
  			}
  		}
  	}
  	if(this.cells_clicked == 9){
  		this.socket.socket_event('data_in_all', this.game_id, {"type": "game_over", 
  			"winner_text": "It was a Draw!!", "winner": 0, "win_map_index": i});
  	}
  }

  add_highlight(win_index) {
  	var winrow = this.win_map[win_index];
  	// console.log(winrow);
  	if(winrow !=  undefined){
	  	for(var i=0; i<winrow.length; i++) {
	  		console.log('row_'+winrow[i][0]+'_col_'+winrow[i][1]);
	  		$('#row_'+winrow[i][0]+'_col_'+winrow[i][1]).css("background-color", '#ffd8e7');
	  	}
  	}
  }

  remove_highlight() {
  	for(var i=0; i<3; i++) {
  		for(var j=0; j<3; j++) {
  			$('#row_'+i+'_col_'+j).css("background-color", "white");
  		}
  	}
  }

  reset_game() {
  	this.socket.socket_event('data_in_all', this.game_id, {"type": "restart"});
  }

  ngOnDestroy() {
    this.socket.io.close();
  }

}
