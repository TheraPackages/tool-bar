'use babel'

window.$ = window.jQuery = require('jquery');

const defaultMockInput = 'input name for this mock item'

export default class MockUnitView {
    createView(mockData) {
        this.mockData = mockData
        this.container = document.createElement('div')
        var divApi = document.createElement('div')
        divApi.className = 'mock_unit_div'
        divApi.innerHTML = "apiName: "+mockData.apiName
        var divFile = document.createElement('div')
        divFile.innerHTML ="file: "+ mockData.mockFile
        divFile.className = 'mock_unit_div'

        this.input = document.createElement('input')
        this.input.type = "text";
        this.input.className = 'mock_unit_input'
        this.input.placeholder = defaultMockInput
        var _this = this
        $(this.input).keydown(function(ev){
            switch (ev.keyCode) {
                case 8: $(_this.input).val(
                    function(index, value){
                        return value.substr(0, value.length - 1);
                    })
                    if(this.value.length == 0){
                        this.placeholder = defaultMockInput
                    }
                    break
                case 13:
                    _this.commitMockDataToServer()
                    break;
            }
        });
        $(this.input).focus(function() {
            $(this).attr('placeholder','');
        });
        this.button = document.createElement('button')
        this.button.innerHTML = 'add mock'
        this.button.onclick = this.commitMockDataToServer.bind(this)
        this.button.style.marginLeft = '15px'
        this.button.className = 'mock_unit_button'

        this.container.appendChild(divApi)
        this.container.appendChild(divFile)
        this.container.appendChild(this.input)
        this.container.appendChild(this.button)


        this.container.style.marginBottom = '20px'
        return this.container
    }

    commitMockDataToServer() {
        apiName = this.mockData.apiName
        mockBody = this.mockData.mockBody
        comment = this.input.value ? this.input.value : 'TheraMock_' + apiName
        var _this = this
        $.post('http://mobile.tmall.net/rocket/api/apiAddMockConfig.php',
            {api: apiName, mock_body: mockBody, mock_script: "", comment: comment}, function (d) {
                var resultDiv = document.createElement('div')
                resultDiv.style.marginLeft = '10px'
                if (d == 1) {
                    console.log("mock-data 添加成功  " + d)
                    _this.button.disabled = true;
                    var url = 'http://mobile.tmall.net/rocket/mock.html?api=' + apiName;
                    var str = "deploy success. you can see result here.";
                    var result = str.link(url);
                    resultDiv.innerHTML = result
                    var shell = require('electron').shell;
                    $(resultDiv).on('click', function (event) {
                        event.preventDefault();
                        shell.openExternal(url);
                    });
                } else {
                    resultDiv.innerHTML = 'deploy failed!'
                    console.log("mock-data 添加失败 " + d)
                }
                _this.container.appendChild(resultDiv)
            })
        // var shell = require('electron').shell;
        // shell.openExternal('http://mobile.tmall.net/rocket/add_mock_config.html?api='+data.api);
    }

}
