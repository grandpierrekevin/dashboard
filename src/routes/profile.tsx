import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <User size={64} className="text-blue-600 dark:text-blue-300" />
          <h2 className="text-xl font-bold">Profil (démo)</h2>
          <div className="text-muted-foreground text-sm text-center">
            <p>Nom : Kevin (Demo)</p>
            <p>Role : Admin</p>
            <p>Email : kevin@demo.dev</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
