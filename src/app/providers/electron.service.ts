import { Injectable } from '@angular/core';
import { maybe } from 'typescript-monads';
import * as electron from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

const maybeElectronRequireFunc = () =>
  maybe(window)
    .flatMap(w => maybe(w.process)
      .filter(p => p.type === 'renderer')
      .map<Function>(_ => w.require));

const mapToRequire = (name: string) => (func: Function) => func(name);

@Injectable()
export class ElectronService {
  private readonly _isElectron = maybeElectronRequireFunc();
  private readonly _easyMap = <T>(name: string) => this._isElectron.map<T>(mapToRequire(name));

  readonly electronWindow = this._easyMap<typeof electron>('electron');
  readonly ipcRenderer = this.electronWindow.map(e => e.ipcRenderer);
  readonly webFrame = this.electronWindow.map(e => e.webFrame);
  readonly remote = this.electronWindow.map(e => e.remote);
  readonly childProcess = this._easyMap<typeof childProcess>('child_process');
  readonly fs = this._easyMap<typeof fs>('fs');
}
