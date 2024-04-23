import { auth } from "@clerk/nextjs/server"

const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");
    return { userId };
}

export const ourFileRouter = {
    
}