// 1. Define the shape of your product metadata
export type ProductMetadata = {
  datasheet_pdf?: string;
  [key: string]: unknown;
}

// 2. Define the shape for our local datasheet state
export type DatasheetItem = {
  name: string
  link: string
}