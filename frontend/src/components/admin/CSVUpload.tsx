import { useState, useRef } from 'react';
import { Upload, FileText, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CSVUploadProps {
  onUpload: (csvData: string) => Promise<{ imported: number; errors: string[] }>;
  onClose: () => void;
}

export function CSVUpload({ onUpload, onClose }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const result = await onUpload(text);
      setResult(result);
      
      if (result.imported > 0) {
        toast.success(`Successfully imported ${result.imported} items`);
      }
      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} rows had errors`);
      }
    } catch (error) {
      toast.error('Failed to import CSV');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'name,description,price,category_id,is_veg,is_jain,is_chefs_special\n' +
      'Paneer Tikka,Grilled cottage cheese,320,1,true,false,true\n' +
      'Butter Chicken,Creamy tomato curry,420,2,false,false,true';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Import Menu from CSV</h3>
        <Button variant="ghost" size="iconSm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <p className="text-muted-foreground mb-2">
          CSV should have columns: name, description, price, category_id, is_veg, is_jain, is_chefs_special
        </p>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Click to select or drag & drop your CSV file
            </p>
          </>
        )}
      </div>

      {result && (
        <div className="bg-card rounded-lg p-4 space-y-2">
          <p className="text-sm">
            <span className="text-success font-medium">{result.imported}</span> items imported successfully
          </p>
          {result.errors.length > 0 && (
            <div className="text-sm">
              <p className="text-destructive font-medium mb-1">Errors:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                {result.errors.slice(0, 5).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
                {result.errors.length > 5 && (
                  <li>...and {result.errors.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? 'Importing...' : 'Import CSV'}
        </Button>
      </div>
    </div>
  );
}
