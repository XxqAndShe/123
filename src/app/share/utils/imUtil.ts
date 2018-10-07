/**
 * Created by Administrator on 2017/4/28.
 */
/**
 * 判断图片
 * @param obj
 * @returns {any}
 */
export function isIMG(obj:string):any {
  obj = obj.toUpperCase();
  let arr = ['.PNG','.JPG','.JPEG','.GIF','.BMP'];
  let img;
  for (let type of arr) {
    if (obj.includes(type)) {
      return true
    }
  }
  return false ;
}

export function getIMG(obj):any {
  let data = ` <a rel="fancybox" href="https://yztfile.gz.bcebos.com/Vu0cWzFZCAFNzWuN.JPG">
                    <img src="${obj}" width="100px"></a> `
  return data
}