import { FileQuestionIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appNavLinks } from "@/data/app-data";

{
  /* NO SUPPORT FOR METADATA in not-found.tsx yet
https://github.com/vercel/next.js/pull/47328#issuecomment-1488891093
Alternative solution: https://github.com/vercel/next.js/issues/45620#issuecomment-1488933853
*/
}

const NotFound = () => {
  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <NotFoundHeader />
      <div className="flex w-full flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col gap-y-8">
          <Card className="w-full shadow-lg">
            <CardContent className="py-6">
              <div className="flex flex-col gap-y-6">
                <ErrorMessage />
                <ReturnHomeButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

const NotFoundHeader = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 text-center">
      <div className="bg-muted/50 flex size-24 items-center justify-center rounded-full">
        <FileQuestionIcon
          className="text-muted-foreground h-12 w-12"
          strokeWidth={2}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">404 Error</p>
      </div>
    </div>
  );
};

const ErrorMessage = () => {
  return (
    <div className="flex flex-col gap-y-3 text-center">
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <p className="text-muted-foreground text-sm">
        Let's get you back on track.
      </p>
    </div>
  );
};

const ReturnHomeButton = () => {
  return (
    <Link href={appNavLinks.home.href}>
      <Button className="flex w-full items-center gap-x-2">
        <HomeIcon className="h-4 w-4" />
        Back to Home
      </Button>
    </Link>
  );
};
