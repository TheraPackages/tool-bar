'use babel'
'use strict'

const path = require('path')
const fsp = require('fs-promise')

const PROJECT_ROOT = /\${workspaceRoot}/g
const ATTACH_RESOURCE = /\${attachPackage}/g
const MAIN_NODE_MODULES_PATH = /\${mainNodeModulesPath}/g

class ConfigurationManager {
    getWatchFilePath() {
        const _this = this
        return this._getConfigObject()
            .then((configObject) => {
                return _this._parse(configObject.main)
            })
    }

    getConfig() {
        const _this = this
        return this._getConfigObject()
            .then((configObject) => {
                let configString = JSON.stringify(configObject)
                return JSON.parse(_this._parse(configString))
            })
    }

    getLaunchConfig() {
        const _this = this
        return this._getConfigObject()
            .then((configObject) => {
                return {
                    appid: configObject.launch.appid,
                    path: _this._parse(configObject.launch.path)
                }
            })
    }

    _getConfigObject() {
        if (!this.lanuchConfigPath) {
            let projectPath = this._projectPath()
            this.lanuchConfigPath = path.join(projectPath, '.thera', 'launch.json')
        }

        return fsp.readJson(this.lanuchConfigPath)
    }

    _parse(value) {
        let projectPath = this._projectPath()
        return value.replace(PROJECT_ROOT, projectPath)
            .replace(ATTACH_RESOURCE, path.join(atom.config.resourcePath, 'node_modules'))
            .replace(MAIN_NODE_MODULES_PATH, path.join(atom.config.resourcePath, 'node_modules'))
    }

    _projectPath() {
        return atom.project.getDirectories()[0].path
    }

    _getMockConfig() {
        if (!this.mockConfigPath) {
            let projectPath = this._projectPath()
            this.mockConfigPath = path.join(projectPath, 'mock', 'config.json')
        }
        return fsp.readJson(this.mockConfigPath);
    }

    _getApiFileContent(path){
        var filePath = this._parse(path)
        if(filePath){
            return fsp.readJson(filePath);
        }
    }

}

module.exports = new ConfigurationManager()