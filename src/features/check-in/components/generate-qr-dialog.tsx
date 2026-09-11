import { useState } from "react";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocationsQuery, useGymProfileQuery } from "@/features/locations/services";
import { useCheckInQrQuery } from "../services";

type GenerateQrDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
};

function printQr(
  qrCode: string,
  locationName: string,
  gymName: string,
  logoUrl: string | null | undefined,
) {
  const win = window.open("", "_blank", "width=794,height=1123");
  if (!win) return;

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="${gymName} logo" class="logo" />`
    : "";

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Check-in QR — ${locationName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    html, body {
      width: 210mm;
      height: 297mm;
      font-family: system-ui, -apple-system, sans-serif;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      position: relative;
    }
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      text-align: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      object-fit: contain;
      border-radius: 8px;
    }
    .gym-name {
      font-size: 13px;
      color: #6b7280;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .location-name {
      font-size: 30px;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
    }
    .qr {
      width: 260px;
      height: 260px;
      display: block;
    }
    .powered {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      color: #9ca3af;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="center">
    ${logoHtml}
    <p class="gym-name">${gymName}</p>
    <p class="location-name">${locationName}</p>
    <img src="${qrCode}" alt="Check-in QR code" class="qr" />
  </div>
  <p class="powered">Powered by ActiveHive</p>
  <script>window.onload = () => { window.print(); window.close(); }<\/script>
</body>
</html>`);

  win.document.close();
}

export function GenerateQrDialog({ open, onOpenChange }: GenerateQrDialogProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const { data: locations, isLoading: locationsLoading } = useLocationsQuery();
  const { data: gymProfile } = useGymProfileQuery();

  const {
    data: qrData,
    isLoading: qrLoading,
    error: qrError,
  } = useCheckInQrQuery(selectedLocationId);

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelectedLocationId(null);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Check-in QR</DialogTitle>
          <DialogDescription>
            Select a location to generate its check-in QR code. Print and place
            it at the entrance — members scan it from the app to check in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <Select
            value={selectedLocationId ?? ""}
            onValueChange={(v) => setSelectedLocationId(v || null)}
            disabled={locationsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  locationsLoading ? "Loading locations…" : "Select a location"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {(locations ?? []).map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.locationName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedLocationId && (
            <div className="flex flex-col items-center gap-4">
              {qrLoading && <Skeleton className="size-52 rounded-lg" />}

              {qrError && !qrLoading && (
                <p className="text-destructive text-center text-sm">
                  Failed to generate QR code. Please try again.
                </p>
              )}

              {qrData && !qrLoading && (
                <>
                  <div className="rounded-lg border border-[#F4F4F4] p-3">
                    <img
                      src={qrData.qrCode}
                      alt={`Check-in QR for ${qrData.locationName}`}
                      className="size-52"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium">{qrData.locationName}</p>
                    <p className="text-muted-foreground text-xs">
                      {qrData.gymName}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      printQr(
                        qrData.qrCode,
                        qrData.locationName,
                        qrData.gymName,
                        gymProfile?.logoUrl,
                      )
                    }
                  >
                    <Printer className="mr-2 size-4" />
                    Print QR code
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
