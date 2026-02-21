"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

const NotFoundPage = () => (
  <div className="flex flex-col items-center mt-[140px]">
    <h1 className="font-bold text-3xl mb-[25px]">Не найдено</h1>
    <Button color="primary" className="flex justify-center">
      <Link href="/">На главную</Link>
    </Button>
  </div>
);

export default NotFoundPage;
