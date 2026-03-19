'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";


export default function Footer() {

  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex w-full max-w-3xl flex-col items-center justify-between bg-white dark:bg-black sm:items-start p-4">
            <div className="flex w-full justify-end text-sm text-gray-400 gap-4">
                <a target="_blank" href="https://github.com/tom20064028/ai-career-toolkit">View Source on GitHub</a>
                <a target="_blank" href="https://github.com/tom20064028/ai-career-toolkit/issues">Report Issue</a>
            </div>
        </main>
    </div>
  );
}
