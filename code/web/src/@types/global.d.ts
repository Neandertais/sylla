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
  }
}
