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
    this.oThinkWord = this.getDOM(".bg .think-word");
    this.oColor = this.getDOM(".bg .color");
    this.oWeather = this.getDOM(".bg .weather");
    this.oWeatherWrap = this.getDOM(".bg .weather-wrap");
    // 执行方法
    this.sysReadyFn();
    this.exeChangeEye();
  }
  // 元素
  oBg = null;
  ot1 = null;
  ot2 = null;
  oSearchInput = null;
  oBaymax = null;
  oFullScreen = null;
  oThinkWord = null;
  oColor = null;
  oWeather = null;
  oWeatherWrap = null;
  // 数据
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
    //
    document.oncontextmenu = () => {
      return false;
    };
    //
    this.showTime();
    this.getPosition();
    this.getTheme();
    //
    this.eventAdd(
      this.oFullScreen,
      "click",
      () => {
        this.fullScreen(document.body);
      },
      true
    );
    //
    this.eventAdd(this.oTimer, "click", (e) => {
      this.changeTimerVisibility(e);
    });
    //
    this.eventAdd(this.oSearchInput, "keypress", (e) => {
      this.handleSearch(e);
    });
    //
    this.eventAdd(
      this.oBaymax,
      "click",
      () => {
        this.handleFocusInput();
      },
      true
    );
    //
    this.eventAdd(
      this.oBg,
      "click",
      () => {
        this.clearInput();
      },
      true
    );
    //
    this.eventAdd(this.oSearchInput, "input", (e) => {
      this.searchThink(e.target.value);
    });
    //
    this.eventAdd(this.oThinkWord, "click", (e) => {
      this.handleChooseThinkWord(e.target);
    });
    //
    this.eventAdd(this.oColor, "click", (e) => {
      this.changeTheme(e.target);
    });
    //
    this.eventAdd(this.oWeatherWrap, "click", (e) => {
      this.changeWeatherDisplay(e.target);
    });
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
    this.clearThinkWord();
  }
  // 搜索联想词
  searchThink(value) {
    if (value) {
      jsonp({
        url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
        data: {
          wd: value,
          _: "1544270132010",
        },
        successName: "cb",
        success: (data) => {
          this.showThinkWord(data);
        },
      });
    } else {
      this.clearThinkWord();
    }
  }
  showThinkWord(data) {
    const wordList = data.s;
    const str = wordList.map((m) => `<div>${m}</div>`).join("");
    this.oThinkWord.innerHTML = str;
  }
  clearThinkWord() {
    this.oThinkWord.innerHTML = "";
  }
  handleChooseThinkWord(target) {
    const value = target.innerHTML;
    if (value) {
      window.open(`https://www.baidu.com/s?wd=${value}`);
    }
  }
  // 位置
  getPosition(isStop = false) {
    if (returnCitySN) {
      const params = {
        province: returnCitySN.cname.split("省")[0],
        city: returnCitySN.cname.split("省")[1],
      };
      if (!params.city) {
        params.province = "浙江";
        params.city = "舟山";
      }
      this.getWeather(params);
    } else {
      if (isStop) return;
      setTimeout(() => {
        this.getPosition(true);
      }, 10000);
    }
  }
  // 天气
  getWeather(params) {
    const weather_hidden = localStorage.getItem("weather_hidden");
    this.initWeatherHidden(weather_hidden);
    jsonp({
      url: "https://wis.qq.com/weather/common",
      data: {
        source: "pc",
        weather_type: "forecast_1h",
        province: params.province,
        city: params.city,
      },
      success: (data) => {
        if (data.status === 200) {
          this.showWeather(data.data);
        }
      },
    });
  }
  showWeather(data) {
    if (data.forecast_1h) {
      const str = Object.values(data.forecast_1h)
        .map(({ update_time, degree, weather, wind_direction, wind_power }) => {
          const date = {
            m: update_time.substring(4, 6),
            w: update_time.substring(6, 8),
            h: update_time.substring(8, 10),
          };
          return `<div>
          <div>${date.m}月${date.w}日${date.h}时</div>
          <div>${weather}&nbsp;${degree}℃</div>
          <div>${wind_direction}&nbsp;${wind_power}级</div>
        </div>`;
        })
        .join("");
      this.oWeather.innerHTML = str;
    }
  }
  changeWeatherDisplay() {
    const isHidden = this.oWeatherWrap.getAttribute("isHidden");
    if (isHidden === "true") {
      this.oWeatherWrap.setAttribute("isHidden", "false");
      this.oWeather.style.display = "grid";
      localStorage.setItem("weather_hidden", "false");
    } else {
      this.oWeatherWrap.setAttribute("isHidden", "true");
      this.oWeather.style.display = "none";
      localStorage.setItem("weather_hidden", "true");
    }
  }
  initWeatherHidden(isHidden) {
    if (isHidden === "true") {
      this.oWeatherWrap.setAttribute("isHidden", "true");
      this.oWeather.style.display = "none";
    } else {
      this.oWeatherWrap.setAttribute("isHidden", "false");
      this.oWeather.style.display = "grid";
    }
  }
  // 切换主题
  changeTheme(target) {
    const theme = target.getAttribute("theme");
    if (theme) {
      this.oBg.className = "bg " + theme;
      localStorage.setItem("bg_theme", theme);
    }
  }
  getTheme() {
    const theme = localStorage.getItem("bg_theme");
    if (theme) {
      this.oBg.className = "bg " + theme;
    }
  }
}
function jsonp(options) {
  const script = document.createElement("script");
  let params = "";
  for (const attr in options.data) {
    params += "&" + attr + "=" + options.data[attr];
  }
  const fnName = "myJsonp" + Math.random().toString().replace(".", "");
  window[fnName] = options.success;
  script.src = `${options.url}?${
    options.successName || "callback"
  }=${fnName}${params}`;
  document.body.appendChild(script);
  script.onload = function () {
    document.body.removeChild(script);
  };
}
// 系统加载完成后需要执行的函数
window.onload = () => {
  window.SysInstance = new SyseEngine();
};
