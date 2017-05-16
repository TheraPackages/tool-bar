'use babel';

import {CompositeDisposable} from 'atom';
const clipboard = require('clipboard');
const fsp = require('fs-promise')
const fs = require('fs')
const path = require('path')
const deployOreoButton = 'deploy_js_file_button'
const configurationManager = require('./configurationManager')
var atomNotifier
let packagePath = atom.packages.resolvePackagePath('atom-notifier')
if (packagePath) atomNotifier = require(packagePath)

let prevFocusedElm = null;

export default class ToolBarButtonView {

    constructor(options) {
        this.options = options;
        this.subscriptions = new CompositeDisposable();
        this.priority = options.priority;

        if (options.image) {
            this.element = document.createElement('img');
            //this.element.setAttribute('src','http://img.zohostatic.com/discussions/v1/images/defaultPhoto.png')
            this.element.setAttribute('src', 'https://img.alicdn.com/tps/TB1PPUKNFXXXXa0XVXXXXXXXXXX-64-64.png')
            this.element.classList.add('div-icon-thera')
        } else {
            this.element = document.createElement('button');
            this.element.id = options.id
            const classNames = ['btn', 'btn-default', 'tool-bar-btn'];
            if (this.priority < 0) {
                classNames.push('tool-bar-item-align-end');
            }
            if (options.iconset) {
                if (options.iconset == 'material-icons') {
                    this.element.textContent = options.icon
                    classNames.push("material-icons")
                } else {
                    classNames.push(options.iconset, `${options.iconset}-${options.icon}`);
                }
            } else {
                classNames.push(`icon-${options.icon}`);
            }

            this.element.classList.add(...classNames);
        }

        if (options.tooltip) {
            this.element.title = options.tooltip;
            this.subscriptions.add(
                atom.tooltips.add(this.element, {
                    title: options.tooltip,
                    placement: this.getTooltipPlacement
                })
            );
        }

        if (!options.menu) {
            this._onClick = this._onClick.bind(this);
            this._onMouseOver = this._onMouseOver.bind(this);

            this.element.addEventListener('click', this._onClick);
            this.element.addEventListener('mouseover', this._onMouseOver);
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
        this.getPrevFocusedElm().focus();
        if (!this.element.classList.contains('disabled')) {
            this.executeCallback(this.options, e);
            if (this.element.id == deployOreoButton) {
                this.deployToOreo()
            }
        }
        e.preventDefault();
        e.stopPropagation();
    }

    _onMouseOver(e) {
        if (!document.activeElement.classList.contains('tool-bar-btn')) {
            prevFocusedElm = document.activeElement;
        }
    }

    getPrevFocusedElm() {
        const workspaceView = atom.views.getView(atom.workspace);
        if (workspaceView.contains(prevFocusedElm)) {
            return prevFocusedElm;
        } else {
            return workspaceView;
        }
    }

    getTooltipPlacement() {
        const toolbarPosition = atom.config.get('tool-bar.position');
        return toolbarPosition === 'Top' ? 'bottom'
            : toolbarPosition === 'Right' ? 'left'
            : toolbarPosition === 'Bottom' ? 'top'
            : toolbarPosition === 'Left' ? 'right'
            : null;
    }

    executeCallback({callback, data}, e) {
        if (typeof callback === 'object' && callback) {
            callback = this.getCallbackModifier(callback, e);
        }
        if (typeof callback === 'string') {
            atom.commands.dispatch(this.getPrevFocusedElm(), callback);
        } else if (typeof callback === 'function') {
            callback(data, this.getPrevFocusedElm());
        }
    }

    getCallbackModifier(callback, {altKey, ctrlKey, shiftKey}) {
        if (!(ctrlKey || altKey || shiftKey)) {
            return callback[''];
        }
        const modifier = Object.keys(callback)
            .filter(Boolean)
            .map(modifiers => modifiers.toLowerCase())
            .reverse()
            .find(item => {
                if ((~item.indexOf('alt') && !altKey) || (altKey && !~item.indexOf('alt'))) {
                    return false;
                }
                if ((~item.indexOf('ctrl') && !ctrlKey) || (ctrlKey && !~item.indexOf('ctrl'))) {
                    return false;
                }
                if ((~item.indexOf('shift') && !shiftKey) || (shiftKey && !~item.indexOf('shift'))) {
                    return false;
                }
                return true;
            });
        return callback[modifier] || callback[''];
    }

    deployToOreo() {
        this.getConfigJsPath().then((deployJsPath)=>{
            let projectPath = atom.project.getDirectories()[0].path
            let defaultFilePath = path.join(projectPath, 'out', 'main.js')
            let deployJsFilePath = deployJsPath ? deployJsPath : defaultFilePath
            fs.exists(deployJsFilePath, (exists) => {
                if (exists) {
                    fsp.readFile(deployJsFilePath)
                        .then((deployJsFile) => {
                            clipboard.writeText(new TextDecoder("utf-8").decode(deployJsFile));
                            this.addSuccess('Content of the deploying file has been copied to clipboard for you !')
                        })
                }
            })
        })
            var shell = require('electron').shell;
            shell.openExternal('http://pre.oreo.alibaba-inc.com/temp/tempList.htm');
    }

    addSuccess (msg) {
        if (atomNotifier) {
            atomNotifier.send({
                getType: () => 'info',
                getMessage: () => 'success',
                getDetail: () => msg
            })
        } else {
            atom.notifications.addInfo(msg)
        }
    }

    getConfigJsPath() {
        return configurationManager.getConfig().then((config) => {
            var weexFile = path.basename(config.main)
            const arr = weexFile.split('\.')
            const weexFileName = arr.length > 0 ? arr[0] : 'unkown'
            let jsName = weexFileName + '.js'
            var transformPath = config.transformPath
            var deployJsPath = path.join(transformPath,jsName)
            console.log('thera-config-js-output ' + deployJsPath)
            return deployJsPath
        })
    }
}

