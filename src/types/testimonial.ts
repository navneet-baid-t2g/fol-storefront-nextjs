// types/testimonial.ts

export type Testimonial ={
  id: number | string;       // ID from Strapi
  name: string;              // Person's name
  designation?: string;      // Optional job title
  company?: string;          // Optional company name
  message: string;           // Testimonial content (Markdown)
  photo?: string | null;     // Full URL to photo
  rating?: number;           // Optional rating (1-5)
}