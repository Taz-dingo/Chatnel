import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server"
import { IncomingForm } from 'formidable'
import { put } from "@/lib/OSS";
import fs from 'fs';
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
    const handleAuth = () => {
        const { userId } = auth();
        if (!userId) throw new Error("用户未登录！");
        return { userId };
    }

    try {
        const { userId } = handleAuth();

        const formData = await req.formData();
        const file = formData.get('file') as File;


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
        const nameFront = `${userId}/${year}_${month}_${day}/`
        const nameBack = new Date().getTime() + '_';

        const response: any = await put(nameFront + nameBack + file.name, tempFile)
        const { url } = response;
        console.log("url: ", url)

        // 上传完成后，删除临时文件和临时目录
        await fs.promises.unlink(tempFile);
        await fs.promises.rmdir(tempDir);

        return NextResponse.json({
            code: 0,
            data: {
                url: url
            }
        })

    } catch (e) {
        console.error(e)
        return NextResponse.json({
            code: 1,
            message: JSON.stringify(e)
        })
    }
}
