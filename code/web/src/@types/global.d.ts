import { pad } from "lodash-es";

export {};

declare global {
  export enum Platforms {
    Website = "Website",
    Facebook = "Facebook",
    Instagram = "Instagram",
    LinkedIn = "LinkedIn",
  }
  interface SocialLink {
    platform: Platforms;
    link: string;
  }

  interface User {
    username: string;
    name?: string;
    cash: number;
    avatarUrl?: string;
    profession?: string;
    biography?: string;
    socialLinks?: {
      website?: string;
      youtube?: string;
      instagram?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      tiktok?: string;
    };
    students?: number;
    evaluations?: number;
  }

  interface Course {
    id: string;
    name: string;
    description?: string;
    price: number;
    willLearn?: string[];
    bannerUrl?: string;
    owner: {
      username: string;
      name?: string;
    };
    sections: Section[];
    rating?: {
      count: number;
      rate: number;
    };
    students?: number;
    isStudent?: boolean;
    isOwner?: boolean;
  }

  interface Section {
    id: string;
    name: string;
    videos?: Video[];
  }

  interface Video {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    created_at: string;
    qualities: string[];
    status?: string;
  }
}
