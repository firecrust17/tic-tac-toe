import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './components/new/new.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
	{
		path: 'new',
		component: NewComponent
	},
	{
		path: 'game/:game_id',
		component: GameComponent
	},
	{
		path: '**',
		redirectTo: '/new'
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
