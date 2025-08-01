import { Upload, FileSpreadsheet, X, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "./card";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface UploadZoneProps {
  onFileUpload?: (file: File) => void;
  isUploading?: boolean;
  className?: string;
}

const UploadZone = ({ onFileUpload, isUploading = false, className }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        onFileUpload?.(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileUpload?.(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      className={cn(
        "border-2 border-dashed transition-all duration-300 cursor-pointer group",
        isDragOver 
          ? "border-blue-400 bg-blue-50 scale-105 shadow-lg" 
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50",
        isUploading && "opacity-75 cursor-not-allowed",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!isUploading ? handleClick : undefined}
    >
      <div className="p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              {isUploading ? (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {isUploading && (
              <div className="space-y-2">
                <p className="text-sm text-blue-600 font-medium">Processing file...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Upload Stock List</h3>
              <p className="text-gray-600">
                Drag and drop your Excel file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls files
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4" />
                Excel Files
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div>Drag & Drop</div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div>Secure Upload</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UploadZone;