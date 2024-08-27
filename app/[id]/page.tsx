"use client";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet } from "@/gql/graphql";
import { useGetUserById } from "@/hooks/user";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user, isLoading, error } = useGetUserById(id);

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
