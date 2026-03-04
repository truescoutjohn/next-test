"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

interface CabinetClientProps {
  email: string;
  createdAt: string | null;
}

const CabinetClient = ({ email, createdAt }: CabinetClientProps) => {
  const formattedCreatedAt =
    createdAt !== null
      ? new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(createdAt))
      : null;

  return (
    <main className="w-full max-w-[1024px] mx-auto px-6 py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <p className="text-default-500 text-sm">
            Управление вашим аккаунтом и данными.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <div>
            <p className="text-sm text-default-500">Email</p>
            <p className="text-base font-medium">{email ?? "Неизвестно"}</p>
          </div>

          {formattedCreatedAt && (
            <div>
              <p className="text-sm text-default-500">Дата регистрации</p>
              <p className="text-base font-medium">{formattedCreatedAt}</p>
            </div>
          )}

          <p className="text-sm text-default-500">
            В будущем здесь можно будет настраивать профиль, управлять
            рецептами и предпочтениями.
          </p>
        </CardBody>
      </Card>
    </main>
  );
};

export default CabinetClient;

