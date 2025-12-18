import Link from "next/link";

import { FlowerMetalBanner } from "@/components/layout/header/flower-metal-banner";
import { Button } from "@/components/ui/button";
import { appNavLinks } from "@/data/app-data";

{
  /* NO SUPPORT FOR METADATA in not-found.tsx yet
https://github.com/vercel/next.js/pull/47328#issuecomment-1488891093
Alternative solution: https://github.com/vercel/next.js/issues/45620#issuecomment-1488933853
*/
}

const NotFound = () => {
  return (
    <div className="bg-background flex h-full max-w-xl grow flex-col items-center gap-6 p-8 pt-48 text-center">
      <FlowerMetalBanner />
      <div className="flex flex-col">
        <h1
          className="text-foreground font-semibold"
          style={{ fontSize: "clamp(24px, 5vw, 48px)" }}
        >
          404 - Page not found
        </h1>
      </div>
      <Button asChild variant="outline">
        <Link
          href={appNavLinks.home.href}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
