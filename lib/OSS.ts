import OSS from 'ali-oss';
import path from 'path';

export const client = new OSS({
    // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
    accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'oss-cn-hongkong',
    // authorizationV4: true,
    // yourBucketName填写Bucket名称。
    bucket: 'chatnel',
});

// 自定义请求头
const headers = {
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    'x-oss-object-acl': 'public-read',
    // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.txt。
    // 'Content-Disposition': 'attachment; filename="example.txt"',
    // 设置Object的标签，可同时设置多个标签。
    'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定PutObject操作时是否覆盖同名目标Object。此处设置为false，表示允许覆盖同名Object。
    'x-oss-forbid-overwrite': 'false',
};

export async function put(fileName: string, filePath: string) {
    try {
        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        const result = await client.put(fileName, path.normalize(filePath)
            // 自定义headers
            , { headers }
        );
        // console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
}

export async function get() {
    try {
        // 填写Object完整路径和本地文件的完整路径。Object完整路径中不能包含Bucket名称。
        // 如果指定的本地文件存在会覆盖，不存在则新建。
        // 如果未指定本地路径，则下载后的文件默认保存到示例程序所属项目对应本地路径中。
        const result = await client.get('exampleobject.txt');
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

async function deleteObject() {
    try {
        // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
        const result = await client.delete('exampleobject.txt');
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
