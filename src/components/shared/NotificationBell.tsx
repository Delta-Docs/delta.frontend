import { Bell, Check } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotifications'
import { formatNotificationTime } from '@/types/notification'

export function NotificationBell() {
  const { data: notifications, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllRead()

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0
  const recentNotifications = notifications?.slice(0, 5) ?? []

  const handleMarkRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    markRead.mutate(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-white/20 transition-colors"
          title="Notifications"
        >
          <Bell className="size-5 text-deep-navy" weight="duotone" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-deep-navy border-white/10 text-white">
        <DropdownMenuLabel className="flex items-center justify-between text-white">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="text-xs text-blue-400 hover:underline font-normal"
              disabled={markAllRead.isPending}
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-400">
            Loading...
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            <Bell className="size-8 mx-auto mb-2 opacity-30" />
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/10 focus:bg-white/10"
                onClick={() => !notification.is_read && markRead.mutate(notification.id)}
              >
                {/* Unread indicator */}
                <div className="shrink-0 mt-1.5">
                  {!notification.is_read ? (
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  ) : (
                    <div className="w-2 h-2" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${notification.is_read ? 'text-gray-400' : 'text-white font-medium'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
                
                {/* Actions */}
                {!notification.is_read && (
                  <button
                    onClick={(e) => handleMarkRead(notification.id, e)}
                    className="shrink-0 p-1 hover:bg-white/20 rounded"
                    title="Mark as read"
                  >
                    <Check className="size-4 text-gray-400" />
                  </button>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
          <Link 
            to="/notifications" 
            className="flex items-center justify-center text-sm text-blue-400 hover:text-blue-300"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
