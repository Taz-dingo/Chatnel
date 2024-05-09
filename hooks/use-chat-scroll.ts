import { count } from "console"
import { useEffect, useState } from "react"

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>
    bottomRef: React.RefObject<HTMLDivElement>
    shouldLoadMore: boolean
    loadMore: () => void
    count: number
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count
}: ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false)

    useEffect(() => {
        const topDiv = chatRef.current
        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore()
            }
        }

        topDiv?.addEventListener("scroll", handleScroll);

        return () => {
            topDiv?.removeEventListener("scroll", handleScroll);
        }

    }, [shouldLoadMore, loadMore, chatRef])

    // 发消息自动滚动到底部
    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef.current;

        // 判断是否要自动滚动到底部
        const shouldAutoScroll = () => {
            // 尚未初始化，需要滚动到底部
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true)
                return true
            }

            if (!topDiv) {
                return false
            }

            // 距离底部距离小于100px时，自动滚动到底部
            // scrollHeight: 内容总高度
            // scrollTop: 滚动条距离顶部的距离
            // clientHeight: 可视区域高度
            const distanceFromBottom =
                topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

            return distanceFromBottom <= 100
        }

        // 自动滚动到底部
        if ((shouldAutoScroll())) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                })
            }, 100);
        }
    }, [bottomRef, chatRef, count, hasInitialized])
}   