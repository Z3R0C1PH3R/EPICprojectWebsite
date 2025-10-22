export interface Event {
  event_number: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: string;
  status: 'Upcoming' | 'Past';
  description: string;
  registrationLink?: string;
  cover_image?: string;
}

export interface Resource {
  resource_number: string;
  title: string;
  type: string;
  description: string;
  download_size: string;
  file: string;
  upload_date: string;
}

export interface Album {
  album_number: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  category: string;
  cover_image: string;
  photos: string[];
}

export interface CaseStudySection {
  heading: string;
  body: string;
  image?: string;
}

export interface CaseStudy {
  case_study_number: string;
  title: string;
  location: string;
  date: string;
  category: string;
  description: string;
  cover_image?: string;
  pdf_file?: string;
  upload_date: string;
  sections?: CaseStudySection[];
}

export interface TeamMember {
  id: string;
  name: string;
  designation?: string;
  role: string;
  department?: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  webpage?: string;
  image?: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}