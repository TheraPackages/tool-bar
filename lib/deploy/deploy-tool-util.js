'use babel'
'use strict'

import MockPanelView from './mock_panel_view'
const configurationManager = require('./configurationManager')
var atomNotifier
let packagePath = atom.packages.resolvePackagePath('atom-notifier')
if (packagePath) atomNotifier = require(packagePath)
const clipboard = require('clipboard');
const fsp = require('fs-promise')
const fs = require('fs')
const path = require('path')

class DeployUtil {
    deployToOreo() {
        this.getConfigJsPath().then((deployJsPath)=> {
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

    addSuccess(msg) {
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
            var deployJsPath = path.join(transformPath, jsName)
            console.log('thera-config-js-output ' + deployJsPath)
            return deployJsPath
        })
    }

    deployToMockServer() {
        configurationManager._getMockConfig().then((config) => {
            if (config.hasOwnProperty('mockData')) {
                config.mockData.forEach((data) => {
                    if (data.hasOwnProperty('api') && data.hasOwnProperty('file'))
                        configurationManager._getApiFileContent(data.file).then((mockContent) => {
                            this.mockDataArray = new Array()
                            var mockData = {
                                apiName: data.api,
                                mockBody: JSON.stringify(mockContent),
                                mockFile: data.file
                            }
                            this.mockDataArray.push(mockData)
                        })
                })
                this.showDeployMockView()
            }
        })
    }

    showDeployMockView() {
        this.mockPanel = new MockPanelView(this.mockDataArray)
        this.mockPanel.show()
    }
}

module.exports = new DeployUtil()
