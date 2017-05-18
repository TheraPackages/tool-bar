'use babel';

import {CompositeDisposable} from 'atom';

let prevFocusedElm = null;

const commandDeviceConnected = 'dumpling-server:client-changed'
const {dialog} = require('electron').remote

export default class ToolBarRefreshButtonView {

    constructor(options) {
        this.options = options;
        this.subscriptions = new CompositeDisposable();
        this.priority = options.priority;

        this.element = document.createElement('button');
        this.element.id = options.id
        this.element.className = 'mdi mdi-refresh btn btn-default tool-bar-btn thera-refresh-button-rotate'

        if (options.tooltip) {
            this.element.title = options.tooltip;
            this.subscriptions.add(
                atom.tooltips.add(this.element, {
                    title: options.tooltip,
                    placement: getTooltipPlacement
                })
            );
        }

        if (!options.menu) {
            this._onClick = this._onClick.bind(this);
            this._onMouseOver = this._onMouseOver.bind(this);

            this.element.addEventListener('click', this._onClick);
            this.element.addEventListener('mouseover', this._onMouseOver);
        }

        this.setEnabled(false)
        atom.commands.add(atom.commands.rootNode, commandDeviceConnected, (event) => this.updateDeviceList(event.detail.data))
    }

    updateDeviceList(deviceList){
        this.connectedDeviceList = deviceList
        if(deviceList != null && deviceList.length > 0){
            this.setEnabled(true)
        } else {
            this.setEnabled(false)
        }
    }


    setEnabled(enabled) {
        if (enabled) {
            this.element.classList.remove('disabled');
        } else {
            this.element.classList.add('disabled');
        }
    }

    destroy() {
        this.subscriptions.dispose();
        this.subscriptions = null;

        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        this.element.removeEventListener('click', this._onClick);
        this.element.removeEventListener('mouseover', this._onMouseOver);
        this.element = null;
    }

    _onClick(e) {
        getPrevFocusedElm().focus();

        if(this.connectedDeviceList != null && this.connectedDeviceList.length > 0){
            // this.element.className = 'mdi mdi-refresh btn btn-default tool-bar-btn thera-refresh-button-rotate'
            // window.setTimeout(function () {
            //     this.element.className = 'mdi mdi-refresh btn btn-default tool-bar-btn'
            // }.bind(this),1030)
            $(this.element).toggleClass('down')
            atom.commands.dispatch(getPrevFocusedElm(), 'core:save');
        }
        e.preventDefault();
        e.stopPropagation();
    }


    _onMouseOver(e) {
        if (!document.activeElement.classList.contains('tool-bar-btn')) {
            prevFocusedElm = document.activeElement;
        }
    }
}

function getPrevFocusedElm() {
    const workspaceView = atom.views.getView(atom.workspace);
    if (workspaceView.contains(prevFocusedElm)) {
        return prevFocusedElm;
    } else {
        return workspaceView;
    }
}

function getTooltipPlacement () {
    const toolbarPosition = atom.config.get('tool-bar.position');
    return toolbarPosition === 'Top' ? 'bottom'
        : toolbarPosition === 'Right' ? 'left'
        : toolbarPosition === 'Bottom' ? 'top'
        : toolbarPosition === 'Left' ? 'right'
        : null;
}

