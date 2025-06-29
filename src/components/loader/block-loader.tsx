import { InlineLoader } from "./inline-loader";

export function BlockLoader() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center">
      <InlineLoader />
    </div>
  );
}
