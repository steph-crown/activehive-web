import type { RefObject } from "react";

import {
  IconCloudUpload,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { GalleryItem } from "./types";

type GalleryStepProps = {
  galleryItems: GalleryItem[];
  galleryInputRef: RefObject<HTMLInputElement | null>;
  isGalleryDragging: boolean;
  setIsGalleryDragging: (value: boolean) => void;
  isGalleryUploading: boolean;
  onAddGalleryFiles: (files: File[]) => void | Promise<void>;
  onRemoveGalleryItem: (id: string) => void;
};

export function GalleryStep({
  galleryItems,
  galleryInputRef,
  isGalleryDragging,
  setIsGalleryDragging,
  isGalleryUploading,
  onAddGalleryFiles,
  onRemoveGalleryItem,
}: GalleryStepProps) {
  return (
    <div className="grid gap-4 rounded-md border border-[#F4F4F4] bg-white p-6">
      <h2 className="text-lg font-semibold">Gallery</h2>
      <p className="text-muted-foreground text-sm">
        Add photos and videos for this location. Files upload right away; you can
        remove any item before you finish.
      </p>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          const list = event.target.files;
          if (list?.length) {
            void onAddGalleryFiles(Array.from(list));
          }
          event.target.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isGalleryUploading) {
            galleryInputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (
            (event.key === "Enter" || event.key === " ") &&
            !isGalleryUploading
          ) {
            event.preventDefault();
            galleryInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!isGalleryUploading) {
            setIsGalleryDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsGalleryDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsGalleryDragging(false);
          if (!isGalleryUploading && event.dataTransfer.files?.length) {
            void onAddGalleryFiles(Array.from(event.dataTransfer.files));
          }
        }}
        className={cn(
          "border-border relative flex min-h-[12.5rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed bg-white px-6 py-10 transition-colors duration-200",
          isGalleryDragging &&
            !isGalleryUploading &&
            "border-primary bg-primary/5",
          !isGalleryDragging &&
            !isGalleryUploading &&
            "border-[#E6E6E6] hover:border-primary/40 hover:bg-muted/30",
          isGalleryUploading && "pointer-events-none opacity-60",
        )}
      >
        <div className="pointer-events-none flex flex-col items-center gap-4">
          <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
            <IconCloudUpload className="text-primary size-6" aria-hidden />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-foreground text-sm">
              <span className="text-primary font-semibold">Click to upload</span>{" "}
              <span className="text-muted-foreground">or drag and drop</span>
            </p>
            <p className="text-muted-foreground text-xs">
              Images and videos — multiple files supported
            </p>
          </div>
        </div>

        {isGalleryUploading && (
          <div className="bg-background/70 absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl">
            <p className="text-foreground text-sm font-medium">Uploading…</p>
          </div>
        )}
      </div>

      {galleryItems.length > 0 && (
        <div className="grid gap-3">
          <Label className="text-foreground">Uploaded media</Label>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {galleryItems.map((item) => (
              <li
                key={item.id}
                className="border-border group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                {item.kind === "image" ? (
                  <img
                    src={item.url}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      src={item.url}
                      className="size-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="pointer-events-none absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      <IconPlayerPlay className="size-3 shrink-0" aria-hidden />
                      Video
                    </div>
                  </>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-1.5 right-1.5 size-8 shrink-0 opacity-90 shadow-sm ring-1 ring-black/5 hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveGalleryItem(item.id);
                  }}
                  aria-label="Remove from gallery"
                >
                  <IconTrash className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
