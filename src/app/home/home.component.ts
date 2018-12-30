import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { fromEvent, EMPTY } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  pic: string;
  constructor(private es: ElectronService, private cd: ChangeDetectorRef) { }

  test() {
    this.es.ipcRenderer.map(a => {
      a.send('show-open-dialog', 123, 456, '123');

      return fromEvent(a, 'response').pipe(take(1));
      // a.on('response', (evt, b) => {
      // console.log(b);
      // });
    })
      .valueOr(EMPTY)
      .pipe(map(a => a[1]), filter(Boolean), map(a => `file://${a}`))
      .subscribe(a => {
        // console.log(a);
        this.pic = a;
        this.cd.detectChanges();
      });
  }
}
