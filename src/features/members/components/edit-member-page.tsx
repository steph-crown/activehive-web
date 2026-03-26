import { useParams } from "react-router-dom";
import { AddMemberPage } from "./add-member-page";

export function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  return <AddMemberPage mode="edit" memberId={id} />;
}
