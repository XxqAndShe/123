/**
 * Created by giscafer on 2017-05-06.
 */
/**
 * base64 转 二进制文件
 * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI
 * @returns {Blob}
 */
export function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}