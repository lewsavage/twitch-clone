import { db } from "./db";
import { getSelf } from "./auth-service";


export const isBlockedByUser = async (id: string) => {
    try {
        const self = await getSelf();
        const otherUser = await db.user.findUnique({
            where: { id }
        })

        if(!otherUser) {
            throw new Error("User not found");
        }

        if (otherUser.id === self.id) {
            return false
        }

        const existingBlock = await db.block.findUnique({
            where: {
                blockerID_blockedID: {
                    blockerID: self.id,
                    blockedID: otherUser.id
                }
            }
        })

        return !!existingBlock;

    } catch {
        return false
    }
}

export const blockUser = async (id: string) => {
    const self = await getSelf();

    if (self.id === id) {
        throw new Error("Cannot block yourself");
    }

    const otherUser = await db.user.findUnique({
        where: { id }
    });

    if (!otherUser) {
        throw new Error("User not found")
    }

    const existingBlock = await db.block.findUnique ({
        where: {
            blockerID_blockedID: {
                blockerID: self.id,
                blockedID: otherUser.id,
            }
        }
    })

    if (existingBlock) {
        throw new Error("User already blocked")
    }

    const block = await db.block.create({
        data: {
            blockerID: self.id,
            blockedID: otherUser.id,
        },
        include: {
            blocked: true,
        }
    })

    return block
}

export const unblockUser = async (id: string) => {
    const self = await getSelf();

    if (self.id === id) {
        throw new Error("Cannot unblock yourself");
    }

    const otherUser = await db.user.findUnique({
        where: { id }
    });

    if (!otherUser) {
        throw new Error("User not found")
    }

    const existingBlock = await db.block.findUnique ({
        where: {
            blockerID_blockedID: {
                blockerID: self.id,
                blockedID: otherUser.id,
            }
        }
    })

    if (!existingBlock) {
        throw new Error("User is not blocked")
    }

    const unblock = await db.block.delete({
        where: {
            id: existingBlock.id,
        },
        include: {
            blocked: true,
        }
    })

    return unblock
}

export const getBlockedUsers = async () => {
    const self = await getSelf();
    const blockedUsers = await db.block.findMany({
        where: {
            blockerID: self.id,
        },
        include: {
            blocked: true,
        },
    });
    return blockedUsers;
}
