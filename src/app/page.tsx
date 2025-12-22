import { FlowerMetalView } from "@/components/table/flower-metal-view";
import { fetchGoogleSheets } from "@/lib/api/fetch-sheets";

const HomePage = async () => {
  const items = await fetchGoogleSheets();

  return <FlowerMetalView items={items} />;
};

export default HomePage;
