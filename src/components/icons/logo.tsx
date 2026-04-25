import { Link } from "react-router-dom";
import LogoIcon from "@/assets/logo.svg?react";
import { HOME_URL } from "@/lib/urls";

export function Logo({ path = HOME_URL }: { path?: string }) {
  const className =
    "flex items-center gap-2 font-medium text-white font-bebas tracking-wider text-lg";

  if (path.startsWith("http")) {
    return (
      <a href={path} className={className}>
        <LogoIcon />
        <p>ACTIVEHIVE</p>
      </a>
    );
  }

  return (
    <Link to={path} className={className}>
      <LogoIcon />
      <p>ACTIVEHIVE</p>
    </Link>
  );
}
