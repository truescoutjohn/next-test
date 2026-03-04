import { auth } from "@/src/auth/auth";
import { getUserFromDb } from "@/src/utils/user";
import { redirect } from "next/navigation";
import CabinetClient from "@/src/app/(protected)/cabinet/cabinet-client";
import { Button } from "@heroui/button";
import Link from "next/link";

const CabinetPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await getUserFromDb(session.user.email);

  return (
    <>
      <div className="flex justify-center mb-4">
          <Link href="/recipes/new">
            <Button color="primary">Добавить рецепт</Button>
          </Link>
        </div>
      <CabinetClient
        email={session.user.email}
        createdAt={user?.createdAt?.toISOString() ?? null}
      />
    </>
  );
};

export default CabinetPage;

