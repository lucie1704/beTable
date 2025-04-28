'use client';

import { Menubar } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut, SessionProvider } from "next-auth/react";

// Composant interne qui utilise useSession
function NavbarContent() {
  const { data: session } = useSession();
  
  return (
    <Menubar className="flex justify-between p-6 shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          Portfolio étudiant
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-700">Bienvenue, {session.user?.name}</span>
            <Button variant="outline" onClick={() => signOut()}>
              Se déconnecter
            </Button>
          </>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">
              Se connecter
            </Link>
          </Button>
        )}
      </div>
    </Menubar>
  );
}

export default function CustomNavbar() {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  );
}