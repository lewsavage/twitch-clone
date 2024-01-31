import { db } from "./db";
import { getSelf } from "./auth-service";

export const getSearch = async (term?: string) => {
    let userId;

    try {
        const self = await getSelf();
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
                },
                OR: [
                    {
                        name: {
                            contains: term,
                        },
                    },
                    {
                        user: {
                            username: {
                                contains: term,
                            }
                        }
                    }
                ]
            },
            select: {
                user: true,
                id: true,
                name: true,
                isLive: true,
                thumbnailUrl: true,
                updatedAt: true,
            },
            orderBy: [
                {
                    isLive: "desc"
                },
                {
                    updatedAt: "desc"
                }
            ]
        })

        return streams;

    } else {
        streams = await db.stream.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: term,
                        },
                    },
                    {
                        user: {
                            username: {
                                contains: term,
                            }
                        }
                    }
                ]
            },
            select: {
                user: true,
                id: true,
                name: true,
                isLive: true,
                thumbnailUrl: true,
                updatedAt: true,
            },
            orderBy: [
                {
                    isLive: "desc"
                },
                {
                    updatedAt: "desc"
                }
            ]
        })

        return streams;
    }
}