'use babel';

import {CompositeDisposable, Emitter} from 'atom';

const GENERIC_DEVICE = 'GenericDevice'

export default class ToolBarTheraView {


  constructor (options) {

    this.element = document.createElement('select');
    this.element.classList.add('form-control-tools')
    this.element.id = options.id


    option1 = document.createElement('option');
    option1.setAttribute("value", GENERIC_DEVICE);
    option1.text = 'Generic Device';

    // option2 = document.createElement('option');
    // option2.setAttribute("value","center1");
    // option2.text = 'iPhone6';
    //
    // option3 = document.createElement('option');
    // option3.setAttribute("value","center2");
    // option3.text = 'iPhone6 plus';


    this.element.add(option1);

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'tool-bar:flash-devicelist', (allDevices) => {
        this.flashDeviceList(allDevices.detail)
      })
    );


    //var optionss = [{name:"iphone6 (iOS10.1)",udid:"xxxxxxxxxxxxxxxxx"},{name:"iphone7 (iOS10.1)",udid:"xxxxxxxxxxxxxxxxx"}];
    //atom.commands.dispatch(atom.views.getView(atom.workspace), 'tool-bar:flash-devicelist', optionss);


  }

  flashDeviceList(options){

    this.element.innerHTML = '';

    let optionDefault = document.createElement('option')
    optionDefault.setAttribute('value', GENERIC_DEVICE)
    optionDefault.text = 'Generic Device'
    this.element.add(optionDefault)

    for (var i=0;i<options.length;i++){
      optiontemp = document.createElement('option');
      optiontemp.setAttribute("value",options[i].udid);
      optiontemp.text = options[i].name;
      this.element.add(optiontemp);
    }

  }

  destroy () {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
