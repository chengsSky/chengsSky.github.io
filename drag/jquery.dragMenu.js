$(
  (function (window, $) {
    DragMenu.prototype.init = function () {
      this.setOffset();
    };

    DragMenu.prototype.setOffset = function () {
      // 初始赋值
      var _this = this;
      var lis = this.getLis();
      $.each(lis, function (index, item) {
        var left = item.offsetLeft;
        var top = item.offsetTop;
        $(item).css({
          left: left,
          top: top,
        });
        item.index = index;
        _this.pos.push({ left: left, top: top });
        _this.bindEvent(item);
      });
      lis.css({ position: 'absolute' });
    };

    DragMenu.prototype.getLis = function () {
      // 获取lis元素
      return $(this.container).find('li');
    };

    DragMenu.prototype.getMin = function (node) {
      // 求出距离最近的元素
      var _this = this;
      var lis = this.getLis();
      var index = null;
      var minDis = Infinity;
      for (var i = 0; i < lis.length; i++) {
        if (node === lis[i]) {
          continue;
        }
        if (this.crashTest(node, lis[i])) {
          var dis = this.calcDistance(node, lis[i]);
          if (dis < minDis) {
            minDis = dis;
            index = i;
          }
        }
      }
      return lis[index];
    };

    DragMenu.prototype.crashTest = function (node1, node2) {
      // 碰撞检测
      var t1 = node1.offsetTop;
      var r1 = node1.offsetWidth + node1.offsetLeft;
      var b1 = node1.offsetHeight + node1.offsetTop;
      var l1 = node1.offsetLeft;

      var t2 = node2.offsetTop;
      var r2 = node2.offsetWidth + node2.offsetLeft;
      var b2 = node2.offsetHeight + node2.offsetTop;
      var l2 = node2.offsetLeft;

      if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
        return false;
      } else {
        return true;
      }
    };

    DragMenu.prototype.calcDistance = function (node1, node2) {
      // 计算出距离
      var a = node1.offsetLeft - node2.offsetLeft;
      var b = node1.offsetTop - node2.offsetTop;
      return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };

    DragMenu.prototype.move = function (node, json) {
      // 移动
      var _this = this;
      node
        .stop()
        .animate(json, this.options.speed, this.options.easing, function () {
          $(node).css({ zIndex: 0 });
          _this.count--;
          !_this.count &&
            typeof _this.options.animateCallback === 'function' &&
            _this.options.animateCallback();
        });
    };

    DragMenu.prototype.bindEvent = function (node) {
      // 事件绑定
      var _this = this;
      node.onmousedown = function (event) {
        var scrollLeft =
          document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;

        //当鼠标按下时计算鼠标与拖拽对象的距离
        _this.disX = event.clientX + scrollLeft - node.offsetLeft;
        _this.disY = event.clientY + scrollTop - node.offsetTop;
        document.onmousemove = function (event) {
          var left = event.clientX - _this.disX + scrollLeft;
          var top = event.clientY - _this.disY + scrollTop;
          $(node).css({ left: left, top: top, zIndex: 1 });
          _this.minNode = _this.getMin(node);
          if (_this.minNode) {
            $(_this.minNode)
              .addClass('active')
              .siblings()
              .removeClass('active');
          }
        };

        document.onmouseup = function (event) {
          document.onmousemove = null;
          document.onmouseup = null;
          _this.getLis().removeClass('active');
          var tempIndex = 0;
          if (_this.minNode) {
            _this.count = 2;
            _this.move($(node), _this.pos[_this.minNode.index]);
            _this.move($(_this.minNode), _this.pos[node.index]);
            tempIndex = _this.minNode.index;
            _this.minNode.index = node.index;
            node.index = tempIndex;
          } else {
            _this.count = 1;
            _this.move($(node), _this.pos[node.index]);
          }
        };
        _this.getMin(node);
        return false;
      };
    };

    function DragMenu(options) {
      this.options = {
        container: '#container',
        easing: 'swing',
        speed: 500,
        animateCallback: function () {},
      };
      this.options = $.extend({}, this.options, options);
      this.container = this.options.container;
      this.disX = 0;
      this.disY = 0;
      this.minZIndex = 0;
      this.minNode = null;
      this.pos = [];
    }

    $.fn.extend({
      dragMenu: function (options) {
        options = options || {};
        options['container'] = this;
        new DragMenu(options).init();
      },
    });
  })(window, jQuery)
);
