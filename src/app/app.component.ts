import {Component, OnInit} from '@angular/core';
import {TextureService} from './texture.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test';

  constructor(public textureService: TextureService) {}

  public ngOnInit(): void {}
}
