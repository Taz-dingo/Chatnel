import { Server, Member, Profile } from "@prisma/client";

/**Server联表Member联表Profile */
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
}