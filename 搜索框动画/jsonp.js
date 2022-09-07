var id;

function chs(res) {
  var html = '';
  res.g.forEach(function (e) {
    html += '<li>' + e.q + '</li>\n';
  });
  document.querySelector('#ulEl').innerHTML = html;
}
document.querySelector('#search-input').oninput = function () {
  function jsonp(url) {
    var fn = 'chs';
    var s = document.createElement('script');
    s.src = url + '&cb=' + fn;
    document.body.appendChild(s);
    s.onload = function () {
      document.body.removeChild(s);
    };
  }
  clearTimeout(id);
  var _this = this;
  id = setTimeout(function () {
    jsonp(
      'https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=pc&from=pc_web&wd=' +
        _this.value
    );
  }, 500);
};
