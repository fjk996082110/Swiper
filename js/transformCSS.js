function transformCSS(node,style,value) {
    //判断store是否存在
    if(node.store === undefined){
        node.store = {};
    }
    //设置样式
    if (arguments.length===3) {
        //将信息保存在对象中
        node.store[style]=value;
        // console.log(node.store);
        //拼串
        let str='';
        for (const i in node.store) {
            //判断style类型
            switch (i) {
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    str +=`${i}(${value}px)`;
                    break;
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                    str += `${i}(${value}deg)`;
                    break;
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':
                    str += `${i}(${value})`;
                    break;
                default:
                    break;
            }
        }
        node.style.transform=str;
    };
    //获取样式
    if (arguments.length===2) {
        //判断是否存在transform,有就获取,没有则默认值返回
        if (node.store[style]===undefined) {
            if(style.substring(0,5)==='scale'){
                return 1;
            }else{
                return 0;
            }
        }else{
            return node.store[style];
        }
    };
}