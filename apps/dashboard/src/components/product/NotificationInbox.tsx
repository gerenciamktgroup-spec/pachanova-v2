"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export function NotificationInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read", notificationId: id }),
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-all-read" }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "hace unos instantes";
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} hr`;
    return `hace ${diffDays} días`;
  };

  return (
    <div className="relative" ref={dropdownRef} data-testid="notification-inbox">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-2 rounded-md border border-pn-border bg-pn-surface hover:bg-pn-surface-strong transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4 text-pn-text" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-pn-bg border border-pn-border rounded-lg shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 bg-pn-surface border-b border-pn-border">
            <span className="text-xs font-semibold text-pn-text">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-pn-gold hover:underline font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-pn-border">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-pn-text-soft">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3 transition-colors ${n.isRead ? "bg-pn-bg" : "bg-pn-surface-strong/30"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className={`text-xs ${n.isRead ? "text-pn-text-soft" : "text-pn-text font-semibold"}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-pn-text-soft leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[9px] text-pn-text-muted block mt-1">
                        {getRelativeTime(n.createdAt)}
                      </span>
                    </div>

                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-pn-gold hover:text-pn-text p-1"
                        title="Marcar como leída"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
