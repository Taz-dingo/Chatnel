import { useSocket } from "@/components/providers/socket-provider";
import { Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string,
}

type MessageWithMemberWithProfile = Message & {
    member: {
        profile: Profile
    }
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey,
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        // 绑定处理消息更新的事件处理函数
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            // 更新 `react-query` 缓存中的数据
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // 如果没有旧数据，或者没有页面数据，返回旧数据
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                // 如果有旧数据，遍历每个页面，找到需要更新的消息，然后返回新数据
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                // 如果找到和更新消息ID相同的项目，则替换掉
                                return message;
                            }
                            // 否则返回未更改的项目
                            return item;
                        })
                    }
                })

                return {
                    ...oldData,
                    pages: newData
                }
            })
        });


        // 绑定处理接收新消息的事件处理函数
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            // 更新 `react-query` 缓存中的数据
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // 如果没有旧数据，或没有页面数据，将新消息作为唯一消息返回
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message]
                        }]
                    }
                }

                // 如果已有数据，将新消息添加到列表的开头
                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]
                }

                return {
                    ...oldData,
                    pages: newData
                };
            });
        });

        return () => {
            socket.off(updateKey);
            socket.off(addKey);
        }
    }, [queryClient, socket, addKey, updateKey, queryKey])


}