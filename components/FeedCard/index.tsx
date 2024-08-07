import Image from "next/image";
import React, { FunctionComponent } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { GoHeart } from "react-icons/go";

const FeedCard: FunctionComponent = () => {
  return (
    <div className="border border-r-0 border-l-0 border-t-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          <Image
            src={`https://avatars.githubusercontent.com/u/110779952?s=400&u=5ec62b1c3b886f69efe8bdc44908a536844b87b5&v=4`}
            alt="user-image"
            height={50}
            width={50}
            className="rounded-full"
          />
        </div>
        <div className="col-span-11 pl-3">
          <h5>Kartik Mahajan</h5>
          <p>
            The pages directory (optional) If you prefer to use the Pages Router
            instead of the App Router, you can create a pages/ directory at the
            root of your project. Then, add an index.tsx file inside your pages
            folder. #codinglife
          </p>
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
