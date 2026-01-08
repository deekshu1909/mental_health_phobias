export interface ExportFormat {
  format: 'csv' | 'json';
  mimeType: string;
  extension: string;
}

export const EXPORT_FORMATS: Record<string, ExportFormat> = {
  csv: {
    format: 'csv',
    mimeType: 'text/csv',
    extension: 'csv'
  },
  json: {
    format: 'json',
    mimeType: 'application/json',
    extension: 'json'
  }
};

export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map(header => `"${header}"`).join(',');

  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
}

export function convertToJSON(data: any[]): string {
  return JSON.stringify(data, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateFilename(dataType: string, format: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${dataType}_${timestamp}.${format}`;
}

export function addMetadata(data: any[], dataType: string): any[] {
  return [
    {
      type: 'metadata',
      exported_at: new Date().toISOString(),
      data_type: dataType,
      record_count: data.length,
      exported_by: 'Admin Panel'
    },
    ...data
  ];
}
