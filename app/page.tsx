"use client";

import { useCallback, useState } from "react";
import FeedCard from "@/components/FeedCard";
import { BiImageAlt } from "react-icons/bi";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { graphQLClient } from "@/clients/api";
import { getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweet();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputChangeFile = useCallback(
    (input: HTMLInputElement) => {
      return async (event: Event) => {
        event.preventDefault();
        const file: File | null | undefined = input.files?.item(0);
        console.log(file);
        if (!file) return;

        const { getSignedURLForTweet } = await graphQLClient.request(
          getSignedURLForTweetQuery,
          {
            imageName: file.name,
            imageType: file.type,
          }
        );

        console.log("getSignedURLForTweet", getSignedURLForTweet);

        if (getSignedURLForTweet) {
          toast.loading("Uploading...", { id: "2" });
          await axios.put(getSignedURLForTweet, file, {
            headers: {
              "Content-Type": file.type,
            },
          });
          toast.success("Upload Completed", { id: "2" });
          const url = new URL(getSignedURLForTweet);
          const myFilePath = `${url.origin}${url.pathname}`;
          setImageURL(myFilePath);
          console.log(imageURL);
        }
      };
    },
    [imageURL]
  );

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handleFn = handleInputChangeFile(input);

    input.addEventListener("change", handleFn);
    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
      imageURL,
    });

    setContent("");
    setImageURL("");
  }, [content, imageURL, mutate]);

  return (
    <div>
      <TwitterLayout>
        <div>
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

                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="tweet-image"
                    width={300}
                    height={300}
                  />
                )}
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
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}
