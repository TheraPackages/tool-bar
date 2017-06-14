'use babel'

window.$ = window.jQuery = require('jquery');

export default class MockUnitView {
    createView(mockData){
        this.mockData = mockData
        this.container = document.createElement('div')
        var divApi = document.createElement('div')
        divApi.innerHTML = mockData.apiName
        var divBody = document.createElement('div')
        divBody.innerHTML = mockData.mockFile
        this.input = document.createElement('input')
        this.input.type = "text";
        var button = document.createElement('button')
        button.innerHTML = '提交'
        button.onclick = this.commitMockDataToServer.bind(this)

        this.container.appendChild(divApi)
        this.container.appendChild(divBody)
        this.container.appendChild(this.input)
        this.container.appendChild(button)

        this.container.style.marginBottom = '20px'
        return this.container
    }

    commitMockDataToServer() {
        apiName = this.mockData.apiName
        mockBody = this.mockData.mockBody
        comment = this.input.value
        $.post('http://mobile.tmall.net/rocket/api/apiAddMockConfig.php',
            {api: apiName, mock_body: mockBody, mock_script: "", comment: comment}, function (d) {
                if (d == 1) {
                    console.log("mock-data 添加成功  " + d)
                    alert('添加成功!' + 'http://mobile.tmall.net/rocket/mock.html?api=' + apiName);
                } else {
                    console.log("mock-data 添加失败 " + d)
                    alert('添加失败!');
                }
            })
        // var shell = require('electron').shell;
        // shell.openExternal('http://mobile.tmall.net/rocket/add_mock_config.html?api='+data.api);
    }

}
