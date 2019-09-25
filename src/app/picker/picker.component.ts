import {Component, OnInit} from '@angular/core';
import {TextureService} from '../texture.service';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnInit {
  colors: string[];
  constructor(private textureService: TextureService) {}

  ngOnInit() {
    this.colors = ['red', 'green', 'blue', 'yellow'];
  }

  setColor(color: string) {
    this.textureService.setActiveColor(color);
  }
}
