import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { IncomingForm } from 'formidable'
import { put } from "@/lib/OSS";
import fs from 'fs';

export async function POST(req: Request) {
    const formData = await req.formData();
    const file: File = formData.get('file');

    // 生成临时文件
    const tempDir = await fs.promises.mkdtemp('tmp-');
    const tempFile = `${tempDir}/${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    await fs.promises.writeFile(tempFile, Buffer.from(arrayBuffer));

    // 为了更好的目录结构，通过/的方式来给阿里云oss存储有一个比较好的目录结构
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth()
    const day = nowDate.getDay()
    const nameFront = year + '/' + month + '/' + day + '/'
    const nameBack = new Date().getTime() + '_';

    const resultUrl = await put(nameFront + nameBack + file.name, tempFile)

    // 上传完成后，删除临时文件和临时目录
    await fs.promises.unlink(tempFile);
    await fs.promises.rmdir(tempDir);

    return NextResponse.json({
        code: 0,
        data: {
            url: resultUrl
        }
    })
}
