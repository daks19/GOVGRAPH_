import { useState } from "react";
import { useLocation } from "wouter";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ChartData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Upload, Link2, Eye, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChartPreview from "@/components/chart-preview";
import { saveCustomChart, generateChartId } from "@/lib/custom-charts";

const sectors = [
  { value: "agriculture", label: "Agriculture & Food Security" },
  { value: "healthcare", label: "Healthcare & Public Health" },
  { value: "education", label: "Education & Learning" },
  { value: "budget", label: "Government Budgets & Finance" },
  { value: "traffic", label: "Transport & Traffic" },
  { value: "utilities", label: "Power & Utilities" }
];

const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" }
];

export default function DataUpload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedChartType, setSelectedChartType] = useState<string>("");
  const [chartTitle, setChartTitle] = useState<string>("");
  const [chartDescription, setChartDescription] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "api">("file");
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // API states
  const [apiUrl, setApiUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  
  // Preview states
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      if (file.name.endsWith('.csv')) {
        // Parse CSV with PapaParse
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const parsedData = parseTableData(results.data);
            setPreviewData(parsedData);
            setShowPreview(true);
            setIsProcessing(false);
          },
          error: (error) => {
            toast({ title: "Error parsing CSV", description: error.message, variant: "destructive" });
            setIsProcessing(false);
          }
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel with SheetJS
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const parsedData = parseTableData(jsonData);
        setPreviewData(parsedData);
        setShowPreview(true);
        setIsProcessing(false);
      } else {
        toast({ title: "Unsupported file type", description: "Please upload CSV or Excel files only.", variant: "destructive" });
        setIsProcessing(false);
      }
    } catch (error) {
      toast({ title: "Error processing file", description: "Failed to process the uploaded file.", variant: "destructive" });
      setIsProcessing(false);
    }
  };

  const handleApiSubmit = async () => {
    if (!apiUrl) {
      toast({ title: "API URL required", description: "Please enter a valid API URL.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    try {
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['api-key'] = apiKey;
      }

      const response = await fetch(apiUrl, { headers });
      const data = await response.json();
      
      let parsedData;
      if (Array.isArray(data)) {
        parsedData = parseTableData(data);
      } else if (data.records) {
        parsedData = parseTableData(data.records);
      } else if (data.data) {
        parsedData = parseTableData(data.data);
      } else {
        // Try to parse the object directly
        parsedData = parseTableData([data]);
      }
      
      setPreviewData(parsedData);
      setShowPreview(true);
      setIsProcessing(false);
    } catch (error) {
      toast({ title: "API Error", description: "Failed to fetch data from API.", variant: "destructive" });
      setIsProcessing(false);
    }
  };

  const parseTableData = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    
    // Find first text field for labels
    const labelField = keys.find(key => 
      typeof firstRow[key] === 'string' && 
      isNaN(Number(firstRow[key]))
    ) || keys[0];
    
    // Find first numeric field for values
    const valueField = keys.find(key => 
      !isNaN(Number(firstRow[key])) && 
      typeof firstRow[key] !== 'boolean'
    ) || keys[1] || keys[0];
    
    const labels = data.map(row => String(row[labelField])).filter(Boolean);
    const values = data.map(row => Number(row[valueField]) || 0).filter(val => !isNaN(val));
    
    // Take only matching pairs
    const minLength = Math.min(labels.length, values.length);
    
    return {
      labels: labels.slice(0, minLength),
      datasets: [{
        label: valueField || "Value",
        data: values.slice(0, minLength),
        backgroundColor: selectedChartType === 'pie' ? [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)", 
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(156, 163, 175, 0.8)"
        ] : "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        fill: selectedChartType === 'line' ? false : undefined,
        tension: selectedChartType === 'line' ? 0.4 : undefined
      }]
    };
  };

  const handleSaveChart = () => {
    if (!selectedSector || !selectedChartType || !chartTitle || !previewData) {
      toast({ title: "Missing information", description: "Please fill all required fields and generate preview.", variant: "destructive" });
      return;
    }

    const customChart: ChartData = {
      id: generateChartId(),
      title: chartTitle,
      description: chartDescription || `Custom ${selectedChartType} chart`,
      source: dataSource || "User uploaded data",
      sector: selectedSector as any,
      type: selectedChartType as any,
      data: previewData,
      lastUpdated: new Date().toISOString()
    };

    saveCustomChart(customChart);
    
    toast({ 
      title: "Chart saved successfully!", 
      description: `Your chart has been added to the ${sectors.find(s => s.value === selectedSector)?.label} sector.`
    });
    
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white" data-testid="data-upload-page">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
            className="mr-4"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold gradient-text" data-testid="page-title">Data Upload</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="bg-netflix-dark border-gray-700" data-testid="chart-details-form">
              <CardHeader>
                <CardTitle className="text-white">Chart Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your chart's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sector" className="text-white">Sector *</Label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger data-testid="sector-select">
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value}>
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="chartType" className="text-white">Chart Type *</Label>
                  <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                    <SelectTrigger data-testid="chart-type-select">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-white">Chart Title *</Label>
                  <Input
                    id="title"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Enter chart title"
                    className="bg-netflix-black border-gray-600 text-white"
                    data-testid="title-input"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={chartDescription}
                    onChange={(e) => setChartDescription(e.target.value)}
                    placeholder="Enter chart description"
                    className="bg-netflix-black border-gray-600 text-white min-h-[80px]"
                    data-testid="description-input"
                  />
                </div>

                <div>
                  <Label htmlFor="source" className="text-white">Data Source</Label>
                  <Input
                    id="source"
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                    placeholder="Enter data source name"
                    className="bg-netflix-black border-gray-600 text-white"
                    data-testid="source-input"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-netflix-dark border-gray-700" data-testid="data-input-form">
              <CardHeader>
                <CardTitle className="text-white">Data Input</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how to provide your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Method Selector */}
                <div className="flex gap-4 mb-6">
                  <Button
                    variant={uploadMethod === "file" ? "default" : "outline"}
                    onClick={() => setUploadMethod("file")}
                    className="flex items-center gap-2"
                    data-testid="file-upload-tab"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </Button>
                  <Button
                    variant={uploadMethod === "api" ? "default" : "outline"}
                    onClick={() => setUploadMethod("api")}
                    className="flex items-center gap-2"
                    data-testid="api-input-tab"
                  >
                    <Link2 className="w-4 h-4" />
                    API Input
                  </Button>
                </div>

                <Separator className="my-4" />

                {uploadMethod === "file" ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file" className="text-white">Upload CSV or Excel File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="bg-netflix-black border-gray-600 text-white file:bg-gov-blue file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                        data-testid="file-input"
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-400 mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiUrl" className="text-white">API URL *</Label>
                      <Input
                        id="apiUrl"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://api.example.com/data"
                        className="bg-netflix-black border-gray-600 text-white"
                        data-testid="api-url-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiKey" className="text-white">API Key (Optional)</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter API key if required"
                        className="bg-netflix-black border-gray-600 text-white"
                        data-testid="api-key-input"
                      />
                    </div>
                    <Button
                      onClick={handleApiSubmit}
                      disabled={isProcessing || !apiUrl}
                      className="w-full"
                      data-testid="fetch-api-button"
                    >
                      {isProcessing ? "Fetching..." : "Fetch Data"}
                    </Button>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
                    <p className="mt-2 text-gray-400">Processing data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {showPreview && previewData && selectedChartType && (
              <Card className="bg-netflix-dark border-gray-700" data-testid="chart-preview">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Chart Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-4">
                    <ChartPreview 
                      data={previewData} 
                      type={selectedChartType as any}
                      title={chartTitle || "Preview Chart"}
                    />
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p><strong>Labels:</strong> {previewData.labels?.slice(0, 3).join(", ")}{previewData.labels?.length > 3 ? "..." : ""}</p>
                    <p><strong>Values:</strong> {previewData.datasets?.[0]?.data?.slice(0, 3).join(", ")}{previewData.datasets?.[0]?.data?.length > 3 ? "..." : ""}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {showPreview && (
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewData(null);
                  }}
                  variant="outline"
                  className="flex-1"
                  data-testid="reset-preview-button"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSaveChart}
                  disabled={!selectedSector || !selectedChartType || !chartTitle || !previewData}
                  className="flex-1 bg-gov-blue hover:bg-gov-light-blue"
                  data-testid="save-chart-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Chart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}