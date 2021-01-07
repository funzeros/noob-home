// 系统加载完成后需要执行的函数
const sysReadyFn = () => {
    document.oncontextmenu =  () => {
        return false;
    };
}


// 窗口加载完成方法
window.onload = () => {
    readyFn();
}