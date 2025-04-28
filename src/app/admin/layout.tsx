'use client';

import { ReactNode } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const handleLogout = () => {
        signOut({
          redirect: true,
          callbackUrl: '/login'
        });
      }
  
  
    return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col gap-2">
            <NavigationMenuItem>
              <a href="/admin/dashboard" className="text-gray-700 hover:text-black">
                Dashboard
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/admin/users" className="text-gray-700 hover:text-black">
                Users
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/admin/settings" className="text-gray-700 hover:text-black">
                Settings
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Se déconnecter</Button>
        </header>

        {/* Content */}
        <main className="p-6">
          {children || (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Welcome to your admin panel!</h2>
                <p className="text-gray-600">
                  Select a page from the sidebar to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
