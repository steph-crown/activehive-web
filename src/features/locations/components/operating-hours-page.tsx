import { DummyDataPage } from "@/components/placeholders/dummy-data-page";
import { useParams } from "react-router-dom";

export function OperatingHoursPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DummyDataPage
      title="Operating Hours"
      description={`Dummy data for this location (${id || "unknown"}).`}
    />
  );
}

