"use client";
import { SkeletonComponent } from "@syncfusion/ej2-react-notifications";
import React from "react";

const TripsLoadingPage = ({ length }: { length: number }) => {
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <div key={idx} className="trip-card">
          {/* Image placeholder */}
          <SkeletonComponent
            width="100%"
            height="100px"
            shape="Rectangle"
            className="mb-2 bg-gray-300"
          />

          {/* Title & Location */}
          <article className="p-4">
            <SkeletonComponent
              width="100%"
              height="20px"
              shape="Text"
              className="mb-2 bg-gray-300"
            />

            <div className="flex items-center gap-2">
              <SkeletonComponent
                width="16px"
                height="16px"
                shape="Circle"
                className="mb-2 bg-gray-300"
              />
              <SkeletonComponent
                width="40%"
                height="14px"
                shape="Text"
                className="mb-2 bg-gray-300"
              />
            </div>
          </article>

          {/* Tags (Chips) */}
          <div className="mt-2 pl-[18px] pr-3.5 pb-5 flex gap-2 flex-wrap">
            <SkeletonComponent
              width="60px"
              height="28px"
              shape="Text"
              className=" bg-gray-300"
            />
            <SkeletonComponent
              width="50px"
              height="28px"
              shape="Text"
              className=" bg-gray-300"
            />
          </div>

          {/* Price Pill */}
          <div className="tripCard-pill">
            <SkeletonComponent width="80px" height="24px" shape="Text" />
          </div>
        </div>
      ))}
    </>
  );
};

export default TripsLoadingPage;
