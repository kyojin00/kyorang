export type Product = {
  id: string;
  name: string;
  price: number;
  image: string; // public 폴더 or 외부 이미지 URL
  badges?: string[];
  likes?: number;
  reviews?: number;
};

export type Review = {
  id: string;
  nickname: string;
  rating: number; // 1~5
  text: string;
  image: string;
};

export const bestProducts: Product[] = [
  { id: "p1", name: "핑크 하트 스티커팩 (10매)", price: 1900, image: "https://picsum.photos/seed/kyorang1/600/600", badges: ["BEST"], likes: 312, reviews: 87 },
  { id: "p2", name: "말랑 키링 - 토끼", price: 5900, image: "https://picsum.photos/seed/kyorang2/600/600", badges: ["인기"], likes: 221, reviews: 64 },
  { id: "p3", name: "미니 메모지 - 크림도트", price: 2500, image: "https://picsum.photos/seed/kyorang3/600/600", badges: ["재입고"], likes: 145, reviews: 31 },
  { id: "p4", name: "데코 씰 세트 - 반짝", price: 3200, image: "https://picsum.photos/seed/kyorang4/600/600", likes: 98, reviews: 19 },
  { id: "p5", name: "엽서 4종 세트", price: 3900, image: "https://picsum.photos/seed/kyorang5/600/600", likes: 83, reviews: 15 },
  { id: "p6", name: "미니 파우치 - 핑크", price: 7900, image: "https://picsum.photos/seed/kyorang6/600/600", badges: ["NEW"], likes: 62, reviews: 9 },
];

export const newProducts: Product[] = [
  { id: "n1", name: "하트 풍선 씰 (한정)", price: 2800, image: "https://picsum.photos/seed/kyorang7/600/600", badges: ["NEW"] },
  { id: "n2", name: "체크 메모패드 A6", price: 3500, image: "https://picsum.photos/seed/kyorang8/600/600", badges: ["NEW"] },
  { id: "n3", name: "키링 - 별사탕", price: 6500, image: "https://picsum.photos/seed/kyorang9/600/600", badges: ["NEW"] },
  { id: "n4", name: "스티커 - 쌀라쌀라", price: 1700, image: "https://picsum.photos/seed/kyorang10/600/600", badges: ["NEW"] },
  { id: "n5", name: "다꾸 데코팩", price: 4900, image: "https://picsum.photos/seed/kyorang11/600/600", badges: ["NEW"] },
];

export const categories = [
  { key: "sticker", label: "스티커" },
  { key: "memo", label: "메모지" },
  { key: "seal", label: "씰/마스킹" },
  { key: "keyring", label: "키링" },
  { key: "postcard", label: "엽서" },
  { key: "diary", label: "다이어리" },
  { key: "pouch", label: "파우치" },
  { key: "random", label: "랜덤박스" },
];

export const reviews: Review[] = [
  { id: "r1", nickname: "핑***", rating: 5, text: "포장 너무 귀엽고 스티커 퀄리티 미쳤어요…💗", image: "https://picsum.photos/seed/kyorangR1/700/520" },
  { id: "r2", nickname: "다***", rating: 5, text: "키링 실물 깡패! 가방에 달자마자 행복해짐", image: "https://picsum.photos/seed/kyorangR2/700/520" },
  { id: "r3", nickname: "쌀***", rating: 4, text: "메모지 색감이 딱 교랑 감성… 재구매할게요!", image: "https://picsum.photos/seed/kyorangR3/700/520" },
];
