'use babel';

import {CompositeDisposable, Emitter} from 'atom';
const electron = require('electron')

const GENERIC_DEVICE = 'GenericDevice'

export default class ToolBarTheraView {


  constructor (options) {

    this.element = document.createElement('select')
    this.element.classList.add('form-control-tools')
    this.element.id = options.id

    option1 = document.createElement('option')
    option1.setAttribute("value", GENERIC_DEVICE)
    option1.text = 'Click to load simulator'
    option1.type = GENERIC_DEVICE

    this.element.add(option1);

    # init symbols-tree-view and weex-run
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-live-server:get-sims')
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'symbols-tree-view:activate')

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'tool-bar:flash-devicelist', (allDevices) => {
        this.flashDeviceList(allDevices.detail)
      })
    );
  }

  flashDeviceList(options){

    this.element.innerHTML = '';

    let optionDefault = document.createElement('option')
    // optionDefault.setAttribute('value', GENERIC_DEVICE)
    // optionDefault.text = 'Generic Device'
    // this.element.add(optionDefault)

    for (var i=0;i<options.length;i++){
      optiontemp = document.createElement('option');
      optiontemp.setAttribute("value",options[i].udid);
      optiontemp.setAttribute("type", options[i].type);
      optiontemp.text = options[i].name;
      this.element.add(optiontemp);
    }

  }

  destroy () {
    this.subscriptions.dispose();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
