import { Link } from "react-router-dom";
import LogoIcon from "@/assets/logo.svg?react";

export function Logo({ path = "/" }: { path?: string }) {
  return (
    <Link to={path} className="flex items-center gap-2 font-medium">
      <LogoIcon />
      <p>ActiveHive</p>
    </Link>
  );
}
