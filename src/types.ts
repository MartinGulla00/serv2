export interface CommentInterface {
  id: string;
  post_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profile?: ProfileInterface;
}

export interface LikesInterface {
  id: string;
  post_id: string;
  profile_id: string;
}

export interface PostInterface {
  id: string;
  description: string;
  image_url: string;
  profile_id: string;
  profile?: ProfileInterface;
  created_at: string;
  likes?: LikesInterface[];
  comments?: CommentInterface[];
}

export interface ProfileInterface {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  full_name: string;
}
