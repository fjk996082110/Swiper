
/**
 *
 *
 * @param {*} selector  选择器
 * @param {*} options   选项对象
 * @constructor
 * @example
 * new Swiper('#swiper-container', {
        loop: true, //无缝滚动
        auto: true, //自动播放
        time: 3000, //切换的时间间隔
        pagination: true //是否显示导航点
    });
    @依赖
    transformCSS.js
 */
function Swiper(selector,options) {
    let auto = options && typeof options === 'object' && !options.auto && options.auto !== undefined ? false : true;
    let time = options && typeof options === 'object' && options.time && typeof options.time === 'number' ? options.time : 3000;
    let loop = options && typeof options === 'object' && !options.loop && options.loop !== undefined ? false : true;
    let pagination = options && typeof options === 'object' && !options.pagination && options.pagination !== undefined ? false : true;
    
    let container = document.querySelector(selector);
    let banner = container.querySelector('.banner');
    let bannerIcons = container.querySelectorAll('.bannerNav li');
    let index = 0;
    let len = banner.querySelectorAll('.banner-item').length;
    let timer = null;
    let isFirst = true;
    let isHori = true;//是否水平方向

    //无缝滚动
    if (loop) banner.innerHTML += banner.innerHTML;

    let bannerItems = banner.querySelectorAll('.banner-item');
    let length = banner.querySelectorAll('.banner-item').length;

    container.addEventListener('touchstart', function (event) {
        clearInterval(timer);
        container.mouseStart = event.changedTouches[0].clientX;
        container.mouseStartY = event.changedTouches[0].clientY;
        banner.style.transition = 'none';
        //检测下标
        if (loop) {
            if (index == 0) {
                index = len;
                switchSlide(index, false);
            } else if (index == length - 1) {
                index = len - 1;
                switchSlide(index, false);
            }
        }
        //获取元素初始的左偏移量和点击时的X距离
        container.eleStart = transformCSS(banner, 'translateX');
    });

    container.addEventListener('touchmove', function (event) {
        //获取结束时点击时的X距离
        container.mouseEnd = event.changedTouches[0].clientX;
        container.mouseEndY = event.changedTouches[0].clientY;
        //滑动距离判断
        let disX = Math.abs(container.mouseEnd - container.mouseStart);
        let disY = Math.abs(container.mouseEndY - container.mouseStartY);
        if (isFirst) {
            isFirst = false;
            if (disX > disY) {
                isHori = true;
            } else {
                isHori = false;
            }
        }
        if (isHori) {
            //阻止默认行为
            event.preventDefault();
        } else {
            return;
        }
        let newLeft = container.mouseEnd - container.mouseStart + container.eleStart;
        transformCSS(banner, 'translateX', newLeft);
    });

    container.addEventListener('touchend', function (event) {
        isFirst = true;
        container.mouseEnd = event.changedTouches[0].clientX;
        let disX = Math.abs(container.mouseEnd - container.mouseStart);
        if (disX >= container.offsetWidth / 2) {
            //偏移检测
            if (container.mouseEnd < container.mouseStart) {
                index++;
            } else if (container.mouseEnd > container.mouseStart) {
                index--;
            }
        }
        switchSlide(index);
        autoPlay();
    });
    //样式初始化
    function init() {
        //设置banner的宽度
        banner.style.width = length + '00%';
        //设置图片宽度
        bannerItems.forEach(function (item) {
            item.style.width = 100 / length + '%';
        });
        //小圆点处理
        if (!pagination) {
            bannerIcons.style.display='none';
        }
        //设置元素的初始化样式
        container.style.overflow='hidden';
        container.style.position='relative';

    };
    //banner图切换
    function switchSlide(j, isTransition = true) {
        //临界值检测
        if (j < 0) {
            j = 0;
        }
        if (j > length - 1) {
            j = length - 1;
        }
        let newLeft = -j * container.offsetWidth;
        if (isTransition) {
            banner.style.transition = 'all .5s';
        } else {
            banner.style.transition = 'none';
        }
        transformCSS(banner, 'translateX', newLeft);
        //小圆点切换
        for (let i = 0; i < bannerIcons.length; i++) {
            bannerIcons[i].className = '';
        }
        //index对len取余，判断小圆点下标
        bannerIcons[j % len].className = 'active';
        index = j;
    };
    init();
    //自动播放
    function autoPlay() {
        if (!auto) return;
        clearInterval(timer);
        timer = setInterval(function () {
            index++;
            switchSlide(index);
        }, time);
    };
    autoPlay();
    //最后一张图片时，切到前边的图
    if (loop) {
        banner.addEventListener('transitionend', function () {
            if(index===length-1){
                index=len-1;
                switchSlide(index,false);
            }
        });
    }
    
    //解决焦点不在时，重新获取焦点，图片错乱的问题
    window.addEventListener('focus', function () {
        autoPlay();
    });
    window.addEventListener('blur', function () {
        clearInterval(timer);
    });
}