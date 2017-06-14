'use babel'
import MockUnitView from './mock_unit_view'

export default class MockPanelView {
    constructor(mockDataArray) {
        var _this = this
        var tbl = document.createElement('table')
        var tbdy = document.createElement('tbody')
        tbl.appendChild(tbdy)
        if (mockDataArray && mockDataArray.length > 0) {
            mockDataArray.forEach(function (mockData) {
                if (mockData.apiName && mockData.mockFile) {
                    var mockUnitView = new MockUnitView().createView(mockData)
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.appendChild(mockUnitView)
                    tr.appendChild(td)
                    tbdy.appendChild(tr)
                }
            })
        }
        tbl.id = 'mock_panel_table'
        tbl.onclick = function () {
            event.cancelBubble = true;
        }
        this.panel = atom.workspace.addModalPanel({
            item: tbl
        })
        atom.views.getView(this.panel).classList.add('thera-mock-modal-panel');
    }

    show() {
        this.previousWindowClickEvent = window.onclick
        window.onclick = this.dismiss.bind(this)
        if (this.panel)  this.panel.show()
    }

    dismiss() {
        if (this.panel)  this.panel.hide()
        window.onclick = this.previousWindowClickEvent
    }
}


