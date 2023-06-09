enum Platforms {
  Website = "Website",
  Facebook = "Facebook",
  Instagram = "Instagram",
  LinkedIn = "LinkedIn",
}

interface SocialLink {
  platform: Platforms;
  link: string;
}

export interface IUser {
  username: string;
  name?: string;
  avatar?: string,
  profession?: string;
  biography?: string;
  socialLinks?: SocialLink[];
}
