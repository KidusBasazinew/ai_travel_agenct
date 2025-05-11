"use client";

import { SkeletonComponent } from "@syncfusion/ej2-react-notifications";
import React from "react";

const UsersLoadingSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length }).map((_, idx) => (
        <div
          key={idx}
          className="grid grid-cols-4 gap-4 items-center bg-white rounded-lg shadow-sm px-4 py-3"
        >
          {/* Name + Avatar */}
          <div className="flex items-center gap-3">
            <SkeletonComponent
              width="32px"
              height="32px"
              shape="Circle"
              className="bg-gray-300"
            />
            <SkeletonComponent
              width="120px"
              height="16px"
              shape="Text"
              className="bg-gray-300"
            />
          </div>

          {/* Email */}
          <SkeletonComponent
            width="160px"
            height="16px"
            shape="Text"
            className="bg-gray-300"
          />

          {/* Date Joined */}
          <SkeletonComponent
            width="100px"
            height="16px"
            shape="Text"
            className="bg-gray-300"
          />

          {/* Status */}
          <div className="flex items-center gap-2">
            <SkeletonComponent
              width="10px"
              height="10px"
              shape="Circle"
              className="bg-gray-300"
            />
            <SkeletonComponent
              width="60px"
              height="16px"
              shape="Text"
              className="bg-gray-300"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersLoadingSkeleton;
