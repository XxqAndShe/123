
/**
* 父子关系的原始数据格式化成树形结构数据
* @param  {Array<Object>} data  原始数据
* @return {Array<Object>}  树形结构数据
*/
export function dataToTree(data) {
    let pos = {},
        tree = [],
        i = 0,
        c = 0,
        count = data.length;
    while (data.length != 0) {
        data[i]['label']=data[i]['name'] || '未命名';
        data[i]['data']=data[i]['id'];
        data[i]['parentId']=data[i]['parent'];
        if (data[i].parent == -1) {
            let tp = data[i];
            tp.children = [];
            tree.push(tp);

            pos[data[i].id] = [tree.length - 1];
            data.splice(i, 1);
            i--;
        } else {
            var posArr = pos[data[i].parent];
            if (posArr != undefined) {

                var obj = tree[posArr[0]];
                for (var j = 1; j < posArr.length; j++) {
                    obj = obj.children[posArr[j]];
                }
                let tp = data[i];
                tp.children = [];

                obj.children.push(tp);
                pos[data[i].id] = posArr.concat([obj.children.length - 1]);
                data.splice(i, 1);
                i--;
            }
        }
        i++;
        c++;
        if (i > data.length - 1) {
            i = 0;
        }
        //避免死循环，浏览器崩溃
        if (c > count * 5) {
            //如果进入此条件证明数据结构是错误的
            return tree;
        }
    }
    return tree;
}

/**
 * getNodeById
 * @param nodes 
 * @param node 
 */
export function getNodeById(nodes:any[],node){
    if(node.parentId && node.parentId!=-1){
        for(let n of nodes){
            if(n.id===node.parentId){
                let children=n.children;
                for(let c of children){
                    if(c.id===node.id){
                        return c;
                    }
                }
            }else{
                let children=n.children;
                for(let c of children){
                    if(c.id===node.parentId){
                        let children2=c.children;
                        for(let c2 of children2){
                            if(c2.id===node.id){
                                return c2;
                            }
                        }
                    }else{
                        //3 level
                        let children2=c.children;
                        for(let c2 of children2){
                            let children3=c.children;
                            // 4 level
                            for(let c3 of children3){
                                if(c3.id===node.id){
                                    return c3;
                                }
                            }
                        }
                    }
                }
            }
        }
    }else{
        //1 level
        for(let n of nodes){
            if(n.id===node.id){
                return n;
            }
        }
    }
}