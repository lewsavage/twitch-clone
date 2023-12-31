"use client"

import { onBlock, onUnblock } from "@/actions/blocked";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner";

interface ActionsProps {
    isFollowing: boolean;
    isBlocked: boolean;
    userId: string;
}

export const Actions = ( { isFollowing, isBlocked, userId }:ActionsProps ) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition( () => {
            onFollow(userId)
            .then( (data) => toast.success(`You are now following ${data.following.username}`))
            .catch( () => toast.error("Something went wrong"))
        });
    }

    const handleUnfollow = () => {
        startTransition( () => {
            onUnfollow(userId)
            .then( (data) => toast.success(`You are no longer following ${data.following.username}`))
            .catch( () => toast.error("Something went wrong"))
        });
    }

    const handleBlock = () => {
        startTransition( () => {
            onBlock(userId)
            .then((data) => toast.success(`${data.blocked.username} has been blocked`))
            .catch( () => toast.error('Something went wrong'))
        })
    }

    const handleUnblock = () => {
        startTransition( () => {
            onUnblock(userId)
            .then((data) => toast.success(`${data.blocked.username} has been unblocked`))
            .catch( () => toast.error('Something went wrong'))
        })
    }

    const onClick = () => {
        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }

    const onClick2 = () => {
        if (isBlocked) {
            handleUnblock();
        } else {
            handleBlock();
        }
    }

    return (
        <>
        <Button onClick={onClick} disabled={isPending} variant="primary">
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button onClick={onClick2} disabled={isPending}>
          {isBlocked ? "Unblock" : "Block"}
        </Button>
        </>
    )
}
