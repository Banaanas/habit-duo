import { FlowerMetalView } from "@/components/table/flower-metal-view";
import { appName, appSlogan } from "@/data/app-data";
import { fetchGoogleSheets } from "@/lib/api/fetch-sheets";

const HomePage = async () => {
  const items = await fetchGoogleSheets();

  return <FlowerMetalView items={items} />;
};

export default HomePage;

export const metadata = {
  title: appName,
  description: appSlogan,
  openGraph: {
    title: appName,
    description: appSlogan,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: appName,
    description: appSlogan,
  },
};
