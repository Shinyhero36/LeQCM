import { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { MenuIcon } from "lucide-react";

export default function Settings() {
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <>
      <Head>
        <title>Le QCM | Settings</title>
        {/* TODO: Add basic head tags */}
      </Head>

      {/* Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="bg-stone-200">
          <Sidebar className="flex w-auto" />
        </SheetContent>
      </Sheet>

      <div className="flex h-screen bg-stone-300/25">
        {/* Fixed sidebar */}
        <Sidebar />
        {/* Content */}
        <main className="my-2 ml-2 mr-2 flex flex-1 flex-col overflow-scroll rounded-xl bg-white p-8 shadow-lg  md:ml-0 ">
          {/* Header */}
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Settings
                </h2>
                <p className="text-sm text-stone-500">
                  Manage your account settings
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() => setOpenSheet(!openSheet)}
                className="inline-flex md:hidden"
              >
                <MenuIcon className="h-8 w-8" />
              </Button>
            </div>
          </div>

          <hr className="my-6 h-[1px] w-full shrink-0 bg-border" />

          {/* Content */}
          <div className="space-y-8">
            {/* Download user data */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Télécharger mes données</CardTitle>
                <CardDescription>
                  Télécharger toutes vos données personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Vous pouvez télécharger toutes vos données personnelles en
                  cliquant sur le bouton ci-dessous.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Télécharger</Button>
              </CardFooter>
            </Card>
            {/* Delete my account */}
            <Card className="border border-destructive shadow-none">
              <CardHeader>
                <CardTitle>Supprimer mon compte</CardTitle>
                <CardDescription>
                  Supprimer votre compte est une action irréversible. Vous
                  perdrez toutes vos données.
                </CardDescription>
              </CardHeader>
              <CardContent>
                La suppression entrainera la suppression de vous les quiz que
                vous avez créé ainsi que de toutes les données à votre sujet.
              </CardContent>
              <CardFooter>
                <Button variant="destructive">Supprimer</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
