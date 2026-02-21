"use client";

import { siteConfig } from "../../../config/site.config";
import { usePathname } from "next/navigation";

const Title = () => {
  const pathname = usePathname();

  const currentNavItem = siteConfig.navigationBar.find(
    (item) => item.href === pathname,
  );

  const pageTitle = currentNavItem ? currentNavItem.name : siteConfig.name;
  return (
    <div className="w-full text-center mt-6 mb-12">
      <h1 className="text-3xl font-bold">{pageTitle}</h1>
    </div>
  );
};

export default Title;
