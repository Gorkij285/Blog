export interface ListState {
  data: any[];
  limitData: number;
  status: null | 'loading' | 'resolved' | 'rejected';
  error: any;
  loading: true | false;
  page: number;
}
export interface StoreState {
  list: ListState;
  profile: ProfileState;
  soloArticle: ArticlesState;
}
export type AsyncThunkResult = {
  arg: number;
  requestId: string;
  requestStatus: 'fulfilled';
  result: [];
  type: string;
};

export interface RootState {
  list: {
    data: [];
    limitData?: number;
  };
}
export interface PostData {
  author: {
    username: string;
    image: string;
  };
  title: string;
  createdAt: string;
  tagList: string[];
  updatedAt: string | null;
  body: string;
  slug: string;
  description: string;
  favorited: boolean;
  favoritesCount: string;
  element: any;
}

export interface ProfileState {
  user: {
    username: string;
    email: string;
    password: string;
    token: string;
  };
  error: boolean | null;
  loading: boolean;
  isLogged: boolean;
  status: string;
  updateCounter: number;
}

export interface loginType {
  email: string;
  password: string | number;
}

export interface User {
  username: string;
  email: string;
  token: string;
  image?: string;
}

export interface UpdateType {
  user: {
    username: string;
    email: string;
    password: string;
    image: string;
  };
}

export type FormValues = {
  cart: {
    name: string;
  }[];
};

export interface UpdatePostDataType {
  updateData: {
    title: string;
    description: string;
    body: string | number;
    tagList: string[];
  };
  slug: string | undefined;
}

export interface CreatePostDataType {
  title?: string;
  description?: string;
  body?: string | number;
  tagList?: string[];
}

export interface ArticleType {
  author: {
    username: string;
    image: string;
    following: boolean;
  };
  body: string;
  createdAt: string;
  description: string;
  favorited: boolean;
  favoritesCount: number;
  slug: string;
  tagList: string[];
  title: string;
  updatedAt: string;
}

export interface ArticlesState {
  articlesData: ArticleType[];
  currentArticle: ArticleType;
}
