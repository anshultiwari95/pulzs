"use client";
import React, { useState } from "react";
import Image from "next/image";
import VideoPlayer from "./components/VideoPlayer";
import { Button } from "../../../components/button";
import { Icons } from "../../../components/icons";
import { Checkbox } from "../../../components/checkbox";
import { Textarea } from "../../../components/textarea";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/tabs";
import ToggleButton from "../../../VideoScreenRecorder/components/toggleButton";
import { Send, SendHorizontal, Type } from "lucide-react";
import TimeStamp from "./components/timestamp";
import GettinResponse from "./components/gettingResponse";
import { MyContextProvider } from "../../../../context/MyContext";

const page = () => {
  return (
    <div className="font-poppins bg-gray-200 min-h-screen w-screen flex flex-col overflow-hidden ">
      <MyContextProvider>
        <GettinResponse />
      </MyContextProvider>
    </div>
  );
};

export default page;

{
}
