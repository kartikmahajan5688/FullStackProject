"use client";
import { ReactNode, useCallback } from "react";
import { BsEnvelope, BsTwitter } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import { PiBookmarkSimpleLight } from "react-icons/pi";
import { RiHome5Fill } from "react-icons/ri";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FeedCard from "@/components/FeedCard";
import { CiCircleMore } from "react-icons/ci";
import { BiMoney } from "react-icons/bi";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

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

//TODO : Scroller should be remove
export default function Home() {
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

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
    },
    []
  );

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1">
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className="mt-1 text-xl pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 justify-start items-center hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer mt-2"
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
        </div>
        <div className="col-span-5 border-l-[1px] border-r-[1px] h-screen overflow-scroll border-gray-600">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5">
          <div className="p-5 bg-slate-700 rounded-lg w-fit">
            <h1 className="my-2 text-2xl"> New to Twitter?</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle}></GoogleLogin>
          </div>
        </div>
      </div>
    </div>
  );
}
