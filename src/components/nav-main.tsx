'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  // Initialize state for each collapsible item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.items && item.items.length > 0) {
        // Check if current path matches any sub-item to keep parent open
        const hasActiveSubItem = item.items.some((subItem) =>
          pathname.startsWith(subItem.url)
        );
        initialState[item.title] = item.isActive || hasActiveSubItem;
      }
    });
    return initialState;
  });

  // Update open state when pathname changes to keep relevant sections open
  useEffect(() => {
    setOpenItems((prev) => {
      const newState = { ...prev };
      items.forEach((item) => {
        if (item.items && item.items.length > 0) {
          const hasActiveSubItem = item.items.some((subItem) =>
            pathname.startsWith(subItem.url)
          );
          if (hasActiveSubItem && !newState[item.title]) {
            newState[item.title] = true;
          }
        }
      });
      return newState;
    });
  }, [pathname, items]);

  const toggleItem = (itemTitle: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            open={openItems[item.title]}
            onOpenChange={() => toggleItem(item.title)}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild={!item.items || item.items.length === 0}
                >
                  {!item.items || item.items.length === 0 ? (
                    <Link href={item.url as any}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && item.items.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url as any}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
