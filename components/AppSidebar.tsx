"use client";
import React, { Suspense } from "react";
import {
  CreditCardIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarMenu,
} from "./ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/app/features/subscriptions/hooks/use-subscription";
import { menuItems } from "@/lib/utils";


export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription()


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Home"
            asChild
            className="gap-x-4 h-10 px-4"
          >
            <Link href="/" prefetch>
              <Image src="/images/logo.svg" alt="logo" width={30} height={30} />
              <span className="font-semibold text-sm">Weava</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
                    asChild
                    className="gap-x-4 h-10 px-4"
                  >
                    <Link href={item.url} prefetch>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading &&
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Upgrade to Pro"} className="gap-x-4 h-10 px-4" onClick={() => authClient.checkout({slug: "pro"})}>
              <StarIcon className="size-4" />
              <span>Upgrade to Pro</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          }
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Billing Portal"} className="gap-x-4 h-10 px-4" onClick={() => authClient.customer.portal()}>
              <CreditCardIcon className="size-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={"Logout"} className="gap-x-4 h-10 px-4" onClick={ () => authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login")
                }
              }
            })}>
              <LogOutIcon className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
