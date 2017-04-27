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
    option1.text = 'no device connected'
    option1.type = GENERIC_DEVICE

    this.element.add(option1);

    this.element.addEventListener("change", function () {
      alert(this.options[this.selectedIndex].innerHTML)
    });

    // init symbols-tree-view and weex-run
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-live-server:get-sims')
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'symbols-tree-view:activate')

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'console.targets', (allDevices) => {
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
      optiontemp.setAttribute("value",options[i].deviceId);
      optiontemp.setAttribute("tag", options[i]);
      optiontemp.text = options[i].model + " - " + (options[i].deviceId.split('|')[1]) + " - " + options[i].weexVersion;

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
