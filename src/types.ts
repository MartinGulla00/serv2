export interface CommentInterface {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface LikesInterface {
  id: string;
  post_id: string;
  user_id: string;
}

export interface PostInterface {
  id: string;
  description: string;
  image_url: string;
  user_id: string;
  created_at: string;
  likes?: LikesInterface[];
  comments?: CommentInterface[];
}
