import { graphQLClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { BiMoney } from "react-icons/bi";
import { BsEnvelope, BsTwitter } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { FaHashtag } from "react-icons/fa";
import { IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import { PiBookmarkSimpleLight } from "react-icons/pi";
import { RiHome5Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import Link from "next/link";

export interface TwitterlayoutProps {
  children: ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: ReactNode;
  link: string;
}

const TwitterLayout: FunctionComponent<TwitterlayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <RiHome5Fill />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <FaHashtag />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <IoNotificationsOutline />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <PiBookmarkSimpleLight />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <IoPersonOutline />,
        link: `/${user?.id}`,
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "More",
        icon: <CiCircleMore />,
        link: "/",
      },
    ],
    [user?.id]
  );

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

  return (
    <div>
      <div className="grid grid-cols-12 md:px-28">
        <div className="col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
          <div>
            <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
              <BsTwitter />
            </div>
            <div className="text-lg pr-4">
              <ul>
                {sidebarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="flex gap-4 justify-start items-center hover:bg-gray-800 rounded-full px-3 py-2 w-fit cursor-pointer mt-2"
                      href={item.link}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 px-3">
              <button className="hidden sm:block bg-[#1d9bf0] py-2 px-4 font-semibold text-lg rounded-full w-full">
                Tweet
              </button>
              <button className="block sm:hidden bg-[#1d9bf0] py-2 px-4 font-semibold text-lg rounded-full w-full">
                <BsTwitter />
              </button>
            </div>
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
              <div className="hidden sm:block gap-1">
                <h3 className="text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-10 sm:col-span-6 border-l-[1px] border-r-[1px] h-screen overflow-scroll border-gray-600">
          {props.children}
        </div>

        <div className="col-span-0 sm:col-span-3 p-5">
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
};

export default TwitterLayout;
