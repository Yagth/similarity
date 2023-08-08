import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import RequestApiKey from "@/components/RequestApiKey";
import ApiDashboard from "@/components/ApiDashboard";
import { db } from "@/lib/db";


export const metadata: Metadata = {
  title: "Similarity API | Dashboard",
  description: "Free and open-source text similarity API",
};

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const apiKey = await db.apiKey.findFirst({
    where: { userId: user.user.id, enabled: true },
  });
  return (
    <div className="max-w-2xl mx-auto mt-16">
      {/*@ts-expect-error Server Component*/}
      {(apiKey ? <ApiDashboard /> : <RequestApiKey />)}
    </div>
  );
};

export default page;
