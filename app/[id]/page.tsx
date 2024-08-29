"use client";
import { graphQLClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet } from "@/gql/graphql";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user, isLoading, error } = useGetUserById(id);
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const amIFollowing = useMemo(() => {
    if (!user) return false;
    return (
      (currentUser?.following?.findIndex((el) => el?.id === user?.id) ?? -1) >=
      0
    );
  }, [currentUser?.following, user]);

  const handleFollowUser = useCallback(async () => {
    await graphQLClient.request(followUserMutation, { to: user.id });
    await queryClient.invalidateQueries(["current-user"]);
  }, [queryClient, user?.id]);

  const handleUnFollowUser = useCallback(async () => {
    await graphQLClient.request(unfollowUserMutation, { to: user.id });
    await queryClient.invalidateQueries(["current-user"]);
  }, [queryClient, user?.id]);

  return (
    <div>
      <TwitterLayout>
        {isLoading ? (
          <p className="m-3 text-lg">Loading.....</p>
        ) : error || !user ? (
          <p className="m-3 text-lg">Error loading user data</p>
        ) : (
          <div>
            <nav className="flex items-center gap-3 p-3">
              <BsArrowLeftShort className="text-3xl" />
              <div>
                <h1 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <h1 className="text-sm font-bold text-slate-500">
                  {user.tweets?.length} Tweets
                </h1>
              </div>
            </nav>

            <div className="p-4 border-b border-slate-800">
              {user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user.profileImageURL}
                  alt="user-image"
                  height={100}
                  width={100}
                />
              )}
              <h1 className="text-xl font-bold mt-5">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex justify-between items-center">
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  <span>{user?.followers?.length} followers</span>
                  <span>{user?.following?.length} followings</span>
                </div>
                {currentUser?.id !== user.id && (
                  <>
                    {amIFollowing ? (
                      <button
                        onClick={handleUnFollowUser}
                        className="bg-white text-black px-3 py-1 rounded-full text-sm"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={handleFollowUser}
                        className="bg-white text-black px-3 py-1 rounded-full text-sm"
                      >
                        Follow
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div>
              {user.tweets?.map((tweet) => (
                <FeedCard data={tweet as Tweet} key={tweet?.id} />
              ))}
            </div>
          </div>
        )}
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;
