/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validatge": "commonjs utf-8-validatge",
            bufferutil: "commonjs bufferutil"
        })
        
        return config
    },
    images: {
        domains: ['chatnel.oss-cn-hongkong.aliyuncs.com'], // 替换为你图片的域名
    },
};

export default nextConfig;
