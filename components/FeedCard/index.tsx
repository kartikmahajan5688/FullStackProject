import { Tweet } from "@/gql/graphql";
import Image from "next/image";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { GoHeart } from "react-icons/go";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: FunctionComponent<FeedCardProps> = (props) => {
  const { data } = props;
  return (
    <div className="border border-r-0 border-l-0 border-t-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Image
              src={data.author?.profileImageURL}
              alt="user-image"
              height={50}
              width={50}
              className="rounded-full"
            />
          )}
        </div>
        <div className="col-span-11 pl-3">
          <h5>
            <Link href={`/${data.author?.id}`}>
              {data.author?.firstName} {data.author?.lastName}
            </Link>
          </h5>
          <p>{data.content}</p>
          <div className="flex justify-between mt-5 text-xl w-[80%]">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <GoHeart />
            </div>
            <div>
              <FiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
