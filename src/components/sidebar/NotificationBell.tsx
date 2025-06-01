import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockNotifications, Notification } from "@/mocks/notifications";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Réinitialiser les notifications mock à chaque ouverture
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-6 w-6" />
          {unread.length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
              {unread.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b font-semibold">
          <span>Notifications</span>
          <button
            className="text-xs text-blue-600 hover:underline disabled:opacity-50"
            onClick={markAllAsRead}
            disabled={unread.length === 0}
          >
            Tout marquer comme lu
          </button>
        </div>
        <ul className="max-h-72 overflow-y-auto divide-y">
          {notifications.length === 0 && (
            <li className="p-4 text-center text-muted-foreground">Aucune notification</li>
          )}
          {unread.map((notif) => (
            <li key={notif.id} className="p-4 flex flex-col gap-1 bg-accent/30">
              <span className="font-medium flex items-center gap-2">
                {notif.type === "success" && <span className="text-green-500">●</span>}
                {notif.type === "info" && <span className="text-blue-500">●</span>}
                {notif.type === "warning" && <span className="text-yellow-500">●</span>}
                {notif.type === "error" && <span className="text-red-500">●</span>}
                {notif.title}
              </span>
              <span className="text-xs text-muted-foreground">{notif.message}</span>
              <span className="text-xs text-right text-muted-foreground">{new Date(notif.date).toLocaleString()}</span>
            </li>
          ))}
          {read.map((notif) => (
            <li key={notif.id} className="p-4 flex flex-col gap-1 opacity-60">
              <span className="font-medium flex items-center gap-2">
                {notif.type === "success" && <span className="text-green-500">●</span>}
                {notif.type === "info" && <span className="text-blue-500">●</span>}
                {notif.type === "warning" && <span className="text-yellow-500">●</span>}
                {notif.type === "error" && <span className="text-red-500">●</span>}
                {notif.title}
              </span>
              <span className="text-xs text-muted-foreground">{notif.message}</span>
              <span className="text-xs text-right text-muted-foreground">{new Date(notif.date).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}; 