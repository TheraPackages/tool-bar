'use babel';

import ToolBarButtonView from './tool-bar-button-view';
import ToolBarSpacerView from './tool-bar-spacer-view';
import ToolBarThera from './tool-bar-thera-button-view';
import ToolBarRefreshButtonView from './tool-bar-refresh-button-view';

export default class ToolBarManager {
  constructor (group, toolBar, legacy) {
    this.group = group;
    this.toolBar = toolBar;
    this._legacy = legacy;
  }

  addButton (options) {
    const button = new ToolBarButtonView(options);
    button.group = this.group;
    this.toolBar.addItem(button);
    if (this._legacy) {
      return legacyWrap(button);
    }
    return button;
  }

  addRefreshButton (options) {
    const button = new ToolBarRefreshButtonView(options);
    button.group = this.group;
    this.toolBar.addItem(button);
    if (this._legacy) {
      return legacyWrap(button);
    }
    return button;
  }

  addSpacer (options) {
    const spacer = new ToolBarSpacerView(options);
    spacer.group = this.group;
    this.toolBar.addItem(spacer);
    if (this._legacy) {
      return legacyWrap(spacer);
    }
    return spacer;
  }

  addThera (options) {
    const thera = new ToolBarThera(options);
    thera.group = this.group;
    this.toolBar.addItem(thera);
    if (this._legacy) {
      return legacyWrap(thera);
    }
    return thera;
  }

  removeItems () {
    if (this.toolBar.items) {
      this.toolBar.items
        .filter(item => item.group === this.group)
        .forEach(item => this.toolBar.removeItem(item));
    }
  }

  onDidDestroy (callback) {
    this.toolBar.emitter.on('did-destroy', callback);
  }
}

function legacyWrap (view) {
  const $ = require('jquery');
  const wrapped = $(view.element);
  ['setEnabled', 'destroy'].forEach(name => {
    if (typeof view[name] === 'function') {
      wrapped[name] = (...args) => view[name](...args);
    }
  });
  wrapped.element = view.element;
  return wrapped;
}
