import { db } from "./db"
import { getSelf } from "./auth-service"

export const getStreams = async () => {
let userId;

try {
    const self = await getSelf();
    userId = self.id;

} catch {
    userId = null;
}

let streams = [];

if (userId) {
    streams = await db.stream.findMany({
        where: {
            user: {
                NOT: {
                    blocking: {
                        some: {
                            blockedID: userId,
                        }
                    }
                }
            }
        },
        select: {
            thumbnailUrl: true,
            name: true,
            isLive: true,
            user: true,
            id: true,
        },
        orderBy: [
            {
            isLive: "desc",
            },
            {
                updatedAt: "desc"
            },
        ]        
    });
}   else {
    streams = await db.stream.findMany({
        select: {
            thumbnailUrl: true,
            name: true,
            isLive: true,
            user: true,
            id: true,
        },
        orderBy: [
            {
            isLive: "desc",
            },
            {
                updatedAt: "desc"
            },
        ]
    })
}

return streams;
}