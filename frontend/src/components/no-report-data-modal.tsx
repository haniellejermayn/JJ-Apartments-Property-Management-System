"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type NoReportDataModalProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export function NoReportDataModal({
  open,
  message,
  onClose,
}: NoReportDataModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Cannot Generate Report
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Suggestions:</strong>
            </p>
            <ul className="mt-2 text-sm text-yellow-700 space-y-1">
              <li>• Ensure there are payments recorded for this month</li>
              <li>• Verify that units have been set up in the system</li>
              <li>• Check if utilities and expenses have been recorded</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
