"use client";

import {
  XShare,
  FacebookShare,
  WhatsappShare,
  TelegramShare,
} from "react-share-kit";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Share:</span>
      <XShare url={url} title={title} />
      <FacebookShare url={url} quote={title} />
      <WhatsappShare url={url} title={title} />
      <TelegramShare url={url} />
    </div>
  );
}