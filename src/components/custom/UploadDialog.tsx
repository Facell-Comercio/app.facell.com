import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaType } from "@/types/media-type";
import { useState } from "react";
import { Button } from "../ui/button";
import { FileUpload } from "./FileUpload";

interface TUploadDialog {
  title: string;
  mediatype: MediaType;
  action: (newUrl?: string | null) => void;
  closeAction: () => void;
  className?: string;
  open?: boolean;
  disabled?: boolean;
}

const UploadDialog = ({
  title,
  mediatype,
  action,
  closeAction,
  open,
}: TUploadDialog) => {
  const [url, setUrl] = useState<string | null | undefined>(null);

  return (
    <Dialog open={open} onOpenChange={closeAction}>
      <DialogContent className="w-full max-w-96">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <section className="max-w-80   max-h-80  mx-auto">
          <FileUpload
            onChange={setUrl}
            value={url || ""}
            mediaType={mediatype}
          />
        </section>
        <DialogFooter className="flex gap-2 sm:gap-0 flex-col">
          <Button variant={"secondary"} onClick={closeAction}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              action(url);
              closeAction();
              setUrl(null);
            }}
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
