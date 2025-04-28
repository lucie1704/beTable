'use client';

import { Menubar } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CustomNavbar() {
  return (
    <Menubar className="flex justify-between p-6 shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          Portfolio étudiant
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/login">
            Se connecter
          </Link>
        </Button>
      </div>
    </Menubar>
  );
}
