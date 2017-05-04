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
    this.target = null

    var _this = this;

    this.element.addEventListener("change", function () {
      _this.selectDeviceOption(this.selectedIndex)

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

    this.element.innerHTML = "";

    let optionDefault = document.createElement('option')
    // optionDefault.setAttribute('value', GENERIC_DEVICE)
    // optionDefault.text = 'Generic Device'
    // this.element.add(optionDefault)

    for (var i=0;i<options.length;i++){
      optiontemp = document.createElement('option');
      optiontemp.value = options[i].deviceId;
      optiontemp.tag = options[i];
      optiontemp.text = options[i].model + " - " + (options[i].deviceId.split('|')[1]) + " - " + options[i].weexVersion;

      this.element.add(optiontemp);
    }

    if(this.element.options.length == 0){
      option1 = document.createElement('option')
      option1.setAttribute("value", GENERIC_DEVICE)
      option1.text = 'no device connected'
      option1.type = GENERIC_DEVICE
      this.element.add(option1);
    } else {
      this.selectDeviceOption(0)
    }
  }

  selectDeviceOption(selectedIndex){
    selectedOption = this.element.options[selectedIndex]
    if((this.target == null)||
        (this.target != null && this.target.deviceId && this.target.deviceId != selectedOption.tag.deviceId)){
      console.log('thera-debugger target changed')
      this.target = selectedOption.tag
      atom.commands.dispatch(atom.views.getView(atom.workspace), "thera-debugger:debugger:main-device", this.target);
    }
    atom.commands.dispatch(atom.views.getView(atom.workspace), "console:changeLogDevice", selectedOption.text);
  }

  destroy () {
    this.subscriptions.dispose();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
