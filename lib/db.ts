import { PrismaClient } from "@prisma/client";

declare global {
    // 声明全局变量所以用var
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// 单例模式，保证全局只有一个prisma实例
if (!globalThis.prisma) {
    globalThis.prisma = db;
}