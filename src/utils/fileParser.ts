import { DataType, FileInfo, JsonData } from "@/stores/useAppStore";

export function parseJsonFile(content: string, type: DataType): JsonData[] {
  if (type === "json") {
    try {
      const parsed = JSON.parse(content);
      return [
        {
          id: Date.now().toString(),
          data: parsed,
        },
      ];
    } catch {
      throw new Error("Invalid JSON format");
    }
  } else if (type === "jsonl") {
    try {
      const lines = content.split("\n").filter((line) => line.trim());
      const jsonData: JsonData[] = [];

      lines.forEach((line, index) => {
        try {
          const parsed = JSON.parse(line);
          jsonData.push({
            id: `${Date.now()}_${index}`,
            data: parsed,
          });
        } catch {
          throw new Error(`Invalid JSON at line ${index + 1}: ${line}`);
        }
      });

      if (jsonData.length === 0) {
        throw new Error("No valid JSON lines found");
      }

      return jsonData;
    } catch (error) {
      throw error;
    }
  }

  throw new Error("Unsupported file type");
}

export function generateChatMessage(fileInfo: FileInfo): string {
  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const fileSize = formatFileSize(fileInfo.size);
  const fileTypeDisplay = fileInfo.type.toUpperCase();

  return `📁 **File uploaded**: ${fileInfo.name}
📊 **Type**: ${fileTypeDisplay}
📏 **Size**: ${fileSize}
📋 **Items**: ${fileInfo.itemCount} ${fileInfo.itemCount === 1 ? "item" : "items"}`;
}
