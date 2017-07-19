import './styles/static/common.styl';
import './styles/static/reset.styl';
import './fonts/iconfont.css';
// api接口地址
var domain = 'https://api.ts57.cn';
// var domain = 'http://192.168.2.11:8080';

// 微官网静态地址
var BASE_URL = 'http://www.lacewang.cn/microWebsite';

var companyId;

var search = c('search');
var logo = c('logo');
var introduce = c('introduce');
var patterns = c('patterns');
var supply = c('supply');
var navigator = c('navigator');
var dress = c('dress');
var contact = c('contact');
var footerTime = c('footerTime');

var indexName = location.host.split('.')[0];
console.log(indexName);
getCompanyId();
function getCompanyId() {
    Ajax({
        url: domain + '/website/getCompanyId',
        headers: {
            'x-client': '4',
            'x-version': '1.0'
        },
        data: {
            indexName: indexName
        },
        success: function(res) {
            if (res.code != 0) {
                alert('获取公司信息失败');
                return;
            }
            companyId = res.data;
            bindClick();
            getCompanyInfo();
        },
        error: function(res) {
            alert('获取数据失败，请检查网络!' + res.message);
        }
    });
}

function bindClick() {
    bind(search, function() {
        location.href = BASE_URL + '/search.html?companyId=' + companyId;
    });

    bind(logo, function() {
        location.href = BASE_URL + '/index.html?companyId=' + companyId;
    });

    bind(introduce, function() {
        location.href = BASE_URL + '/introduce.html?companyId=' + companyId;
    });

    bind(patterns, function() {
        location.href = BASE_URL + '/index.html?companyId=' + companyId;
    });

    bind(supply, function() {
        location.href = BASE_URL + '/index.html?companyId=' + companyId + '&activeIndex=1';
    });

    bind(dress, function() {
        location.href = BASE_URL + '/dress.html';
    });

    bind(contact, function() {
        location.href = BASE_URL + '/infomation.html?companyId=' + companyId;
    });
}


// 根据companyId 获取公司信息
function getCompanyInfo() {
    Ajax({
        url: domain + '/company/getCompanyInfo',
        data: {
            companyId: companyId
        },
        headers: {
            'x-client': '4',
            'x-version': '1.0'
        },
        success: function(res) {
            // console.log('返回的公司信息', res.data);
            if (res.code != 0) {
                alert('获取公司信息失败');
                return;
            }
            var data = res.data;
            var mapAddress = {
                // 获取公司地址经纬度
                lat: data.lat,
                lng: data.lng,
                // 地图上显示的公司地址
                address: data.address,
                // 地图上显示的公司名称(地点名称);
                title: data.companyName
            };

            bind(navigator, function() {
                location.href = BASE_URL + '/mapNav.html?lat=' + mapAddress.lat + '&lng=' + mapAddress.lng + '&title=' + mapAddress.title + '&address=' + mapAddress.address;
            });
            if (data.companyHeadIcon) {
                logo.style.backgroundImage = 'url(' + data.companyHeadIcon + ')';
            }
            footerTime.innerHTML = 'Copyright © ' + new Date().getFullYear() + ' ' + data.companyName + ' 版权所有';
        },
        error: function(res) {
            alert('获取数据失败，请检查网络!' + res.message);
        }
    });
}

// 这里只需要click事件
function bind(ele, fn) {
    ele.addEventListener('click', fn, false);
}

function c(str) {
    return document.getElementById(str);
}

function Ajax(opts) {
    let defaults = {
        method: 'GET',
        url: '',
        data: '',
        async: true,
        cache: true,
        contentType: 'text/plain',
        headers: {},
        timeout: 10000,
        success: function() {},
        error: function() {}
    };
    // 为defaults赋值
    for (let key in opts) {
        defaults[key] = opts[key];
    }
    // 将data转为str
    if (typeof defaults.data === 'object') {
        let str = '';
        for (let key in defaults.data) {
            str += key + '=' + defaults.data[key] + '&';
        }
        defaults.data = str.substring(0, str.length - 1);
    }

    // 处理请求方式
    defaults.method = defaults.method.toUpperCase();
    // 处理cache
    defaults.cache = defaults.cache ? '' : '&' + new Date().getTime();

    // 处理url 拼接字符串
    if (defaults.method === 'GET' && (defaults.data || defaults.cache)) {

        defaults.url += '?' + defaults.data + defaults.cache;
    }
    // 创建ajax 对象
    const xhr = new XMLHttpRequest();

    // console.info(defaults.method);
    xhr.open(defaults.method, defaults.url, defaults.async);

    // 设置header
    for (let key in defaults.headers) {
        if (!defaults.headers.hasOwnProperty(key)) {
            continue;
        }
        xhr.setRequestHeader(key, defaults.headers[key]);
        // console.log(xhr)
    }

    // 处理 GTE POST
    if (defaults.method === 'GET') {
        xhr.send(null);
    } else if (defaults.method === 'POST') {

        xhr.setRequestHeader('Content-Type', defaults.contentType);
        xhr.send(defaults.data);
    }
    let timer = setTimeout(function() {
        if (!(xhr.readyState === 4 && xhr.status === 200)) {
            xhr.abort();
            defaults.error({ message: '请求超时' });
        }
    }, defaults.timeout);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // console.log('返回值', xhr.responseText);
                let response = JSON.parse(xhr.responseText);
                clearTimeout(timer);
                defaults.success.call(xhr, response, xhr.status, xhr);
            } else {
                clearTimeout(timer);
                defaults.error(xhr.responseText);
            }
        }
    };
}
