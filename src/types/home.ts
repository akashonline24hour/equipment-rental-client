export interface CategoryCount {
  category: string;
  count: number;
}

export interface Review {
  _id: string;
  name: string;
  title: string;
  rating: number;
  comment: string;
}

export interface TopOwner {
  name: string;
  image: string;
  listings: number;
}
