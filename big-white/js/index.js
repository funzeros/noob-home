class SyseEngine {
  constructor() {
    //  获取元素
    this.oBg = this.getDOM(".bg", document.body);
    this.ot1 = this.getDOM(".bg .timer .t1");
    this.ot2 = this.getDOM(".bg .timer .t2");
    this.oTimer = this.getDOM(".bg .timer");
    this.oSearchInput = this.getDOM(".bg .search-input");
    this.oBaymax = this.getDOM(".bg .baymax");
    this.oFullScreen = this.getDOM(".bg .full-screen");
    // 执行方法
    this.sysReadyFn();
    this.exeChangeEye();
  }
  // 元素和属性
  oBg = null;
  ot1 = null;
  ot2 = null;
  oSearchInput = null;
  oBaymax = null;
  oFullScreen = null;
  weekMap = {
    0: "日",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
  };
  // 注册的方法
  // 取DOM方法
  getDOM(selector, defaultDOM = null) {
    return document.querySelector(selector) || defaultDOM;
  }
  // 系统初始化
  sysReadyFn() {
    document.oncontextmenu = () => {
      return false;
    };
    this.showTime();
    this.eventAdd(
      this.oFullScreen,
      "click",
      () => {
        this.fullScreen(document.body);
      },
      true
    );
    this.eventAdd(this.oTimer, "click", (e) => {
      this.changeTimerVisibility(e);
    });
    this.eventAdd(this.oSearchInput, "keypress", (e) => {
      this.handleSearch(e);
    });
    this.eventAdd(
      this.oBaymax,
      "click",
      () => {
        this.handleFocusInput();
      },
      true
    );
    this.eventAdd(
      this.oBg,
      "click",
      () => {
        this.clearInput();
      },
      true
    );
  }
  // 绑定事件
  eventAdd(el, event, fn, isTarget = false, useCap = false) {
    el.addEventListener(
      event,
      (e) => {
        e.stopPropagation();
        if (!isTarget || e.target === el) {
          fn(e);
        }
      },
      useCap
    );
  }
  /**
   * 标题眨眼
   * 👀
   */
  changeEye() {
    document.title = "👀";
    setTimeout(() => {
      document.title = "--";
    }, 3100);
    setTimeout(() => {
      document.title = "👀";
    }, 5800);
  }
  exeChangeEye() {
    this.changeEye();
    setInterval(() => {
      this.changeEye();
    }, 6000);
  }
  // 全屏
  fullScreen(el) {
    const isFullscreen =
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    if (!isFullscreen) {
      //进入全屏,多重短路表达式
      (el.requestFullscreen && el.requestFullscreen()) ||
        (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
        (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
        (el.msRequestFullscreen && el.msRequestFullscreen());
      this.oFullScreen.innerHTML = "退出全屏";
    } else {
      //退出全屏,三目运算符
      document.exitFullscreen
        ? document.exitFullscreen()
        : document.mozCancelFullScreen
        ? document.mozCancelFullScreen()
        : document.webkitExitFullscreen
        ? document.webkitExitFullscreen()
        : "";
      this.oFullScreen.innerHTML = "进入全屏";
    }
  }
  //  时钟
  transForm(n) {
    if (n < 10) {
      return "0" + n;
    } else {
      return "" + n;
    }
  }
  transformC(num) {
    return this.weekMap[num];
  }
  showDate() {
    const oDate = new Date();
    const gYear = oDate.getFullYear();
    const gMonth = oDate.getMonth() + 1;
    const gDay = oDate.getDate(); /*表示获取天*/
    const gDay1 = oDate.getDay();
    const gHour = oDate.getHours();
    const gMinute = oDate.getMinutes();
    const gSeconds = oDate.getSeconds();
    const t1 =
      this.transForm(gYear) +
      "年" +
      this.transForm(gMonth) +
      "月" +
      this.transForm(gDay) +
      "日" +
      "  " +
      "星期" +
      this.transformC(gDay1);
    const t2 =
      this.transForm(gHour) +
      ":" +
      this.transForm(gMinute) +
      ":" +
      this.transForm(gSeconds);
    this.ot1.innerHTML = t1;
    this.ot2.innerHTML = t2;
  }
  showTime() {
    this.showDate();
    setInterval(() => {
      this.showDate();
    }, 500);
    const timer_invisible = this.getTimerInvisible();
    timer_invisible.date && (this.ot1.style.display = "none");
    timer_invisible.time && (this.ot2.style.display = "none");
  }
  // 获取本地存储的时间
  getTimerInvisible() {
    return JSON.parse(localStorage.getItem("timer_invisible") || "{}");
  }
  // 切换时钟的显隐
  changeTimerVisibility(e) {
    if (e.target !== this.oTimer) {
      // e.target.style.visibility = "hidden";
      e.target.style.display = "none";

      const name = e.target.getAttribute("name");
      const timer_invisible = this.getTimerInvisible();
      timer_invisible[name] = true;
      localStorage.setItem("timer_invisible", JSON.stringify(timer_invisible));
    } else {
      // this.ot1.style.visibility = "visible";
      // this.ot2.style.visibility = "visible";
      this.ot1.style.display = "block";
      this.ot2.style.display = "block";
      localStorage.removeItem("timer_invisible");
    }
  }
  /**
   * 搜索
   * http://www.baidu.com/s?wd=关键字
   */
  handleSearch(e) {
    if (e.code !== "Enter") return;
    const value = e.target.value;
    window.open(`https://www.baidu.com/s?wd=${value}`);
  }
  // 点击黑色部分时激活输入框
  handleFocusInput() {
    this.oSearchInput.focus();
  }
  // 清除输入框
  clearInput() {
    this.oSearchInput.value = "";
  }
}
// 系统加载完成后需要执行的函数
window.onload = () => {
  new SyseEngine();
};
