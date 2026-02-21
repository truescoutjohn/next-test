"use client";
import { siteConfig } from "@/src/config/site.config";
import { usePathname } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";

const PageContent = () => {
  const pathname = usePathname();
  const pageContent =
    siteConfig.pagesContent[pathname as keyof typeof siteConfig.pagesContent];

  if (!pageContent) {
    return <div>Страница не найдена</div>;
  }

  const cleanHTML = DOMPurify.sanitize(pageContent.content);
  return (
    <div className="max-w-[1024px] mx-auto px-[24px]">{parse(cleanHTML)}</div>
  );
};

export default PageContent;
