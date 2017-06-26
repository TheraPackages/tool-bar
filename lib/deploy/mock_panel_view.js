'use babel'
import MockUnitView from './mock_unit_view'

const prompt = 'After testing the mock data locally, if you want to deploy the mock to server ' +
    'or share it with test engineers, you can click "add mock" button to deploy the corresponding api data file. ' +
    'Then you can find your mock data at '

export default class MockPanelView {
    constructor(mockDataArray) {
        var _this = this
        var tbl = document.createElement('table')
        tbl.id = 'thera_mock_panel_table'
        // 增加title
        var caption = document.createElement("caption");
        caption.innerHTML = "Mock Deployment";
        caption.id = 'thera_mock_panel_table_title'
        tbl.appendChild(caption);

        var thead = document.createElement('thead');
        tbl.appendChild(thead)

        //设置第一行：描述栏
        var tr = document.createElement('tr');
        var td = document.createElement('td');

        var str = " mock center ";
        var result = str.link('http://mobile.tmall.net/rocket/api_mock.html');
        td.innerHTML = prompt + result + '.'

        var shell = require('electron').shell;
        $(td).on('click', 'a[href^="http://mobile.tmall.net/rocket/api_mock.html"]', function (event) {
            event.preventDefault();
            shell.openExternal(this.href);
        });

        td.id = 'thera_device_panel_table_prompt'
        td.colSpan = this.columnNum + 1;
        tr.appendChild(td)
        thead.appendChild(tr);

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


