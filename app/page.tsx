"use client";

import { ReactNode, useCallback, useState } from "react";
import { BsEnvelope, BsTwitter } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import { PiBookmarkSimpleLight } from "react-icons/pi";
import { RiHome5Fill } from "react-icons/ri";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FeedCard from "@/components/FeedCard";
import { CiCircleMore } from "react-icons/ci";
import { BiImageAlt, BiMoney } from "react-icons/bi";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

interface TwitterSidebarButton {
  title: string;
  icon: ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <RiHome5Fill />,
  },
  {
    title: "Explore",
    icon: <FaHashtag />,
  },
  {
    title: "Notifications",
    icon: <IoNotificationsOutline />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <PiBookmarkSimpleLight />,
  },
  {
    title: "Profile",
    icon: <IoPersonOutline />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "More",
    icon: <CiCircleMore />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const queryClient = useQueryClient();
  const { mutate } = useCreateTweet();

  const [content, setContent] = useState("");

  // console.log(user);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphQLClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Success");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken) {
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
      }

      await queryClient.invalidateQueries(["current-user"]);
    },
    []
  );

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);

  return (
    <div>
      <div className="grid grid-cols-12 px-56">
        <div className="col-span-3 pt-1 relative">
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className="text-lg pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 justify-start items-center hover:bg-gray-800 rounded-full px-3 py-2 w-fit cursor-pointer mt-2"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 pl-0 pr-12">
            <button className="bg-[#1d9bf0] p-2 font-semibold text-lg rounded-full w-full">
              Tweet
            </button>
          </div>
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-400 px-2 py-1 rounded-full">
              <Image
                className="rounded-full"
                src={user?.profileImageURL || ""}
                alt="user-image"
                width={50}
                height={50}
              />
              <div className="flex gap-1">
                <h3 className="text-lg">{user?.firstName}</h3>
                <h3 className="text-lg">{user?.lastName}</h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-6 border-l-[1px] border-r-[1px] h-screen overflow-scroll border-gray-600">
          <div className="border border-r-0 border-l-0 border-t-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="col-span-11 pl-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  rows={4}
                  placeholder="What's happening?"
                ></textarea>
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt className="text-xl" onClick={handleSelectImage} />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] px-4 py-2 font-semibold text-sm rounded-full"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) =>
            tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
          )}
        </div>
        <div className="col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg w-fit">
              <h1 className="my-2 text-2xl"> New to Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle}></GoogleLogin>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
