import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TextureService {
  private readonly _texture: BehaviorSubject<string>;
  constructor() {
    this._texture = new BehaviorSubject('white');
  }

  setActiveColor(color: string) {
    this._texture.next(color);
  }

  public get texture$(): Observable<string> {
    return this._texture.asObservable();
  }
}
