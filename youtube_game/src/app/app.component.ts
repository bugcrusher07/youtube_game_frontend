import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameScene } from './game/game-scene/game-scene.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,GameScene],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'youtube_game';
}

