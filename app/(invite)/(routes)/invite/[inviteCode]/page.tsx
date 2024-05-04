import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params) {
    return redirect("/");
  }
  // 检查是否已经是服务器成员
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  // 如果已经是服务器成员，直接跳转到服务器页面
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // 当前用户不是服务器成员，尝试加入服务器
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
