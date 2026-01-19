export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  name: string;
  price: number; // 원화 정수
  images: string[];
  tags: string[];
  shortDesc: string;
  desc: string;
  options: ProductOption[];
  shipping: {
    fee: number;
    freeOver: number;
    eta: string;
  };
  notice: {
    returns: string[];
    care: string[];
  };
};

export const PRODUCTS: Product[] = [
  {
    id: "kyorang1",
    name: "말랑 하트 키링 (핑크)",
    price: 5900,
    images: [
      "https://picsum.photos/seed/kyorang1/900/900",
      "https://picsum.photos/seed/kyorang1b/900/900",
      "https://picsum.photos/seed/kyorang1c/900/900",
      "https://picsum.photos/seed/kyorang1d/900/900",
    ],
    tags: ["베스트", "선물추천", "말랑감성"],
    shortDesc: "가방에 달면 하루종일 기분 좋아지는 말랑 하트 키링 💗",
    desc:
      "교랑상점 감성으로 고른 말랑 하트 키링이에요. 가벼운 무게로 어디든 포인트가 되고, 컬러가 은은해서 데일리로 쓰기 좋아요.\n\n- 소재: TPU/아크릴 혼합\n- 사이즈: 약 4~6cm (디자인별 상이)\n- 구성: 키링 1개",
    options: [
      { name: "컬러", values: ["핑크", "오프화이트", "라벤더"] },
      { name: "포장", values: ["기본 포장", "선물 포장(+1000원)"] },
    ],
    shipping: {
      fee: 3000,
      freeOver: 30000,
      eta: "평일 오후 2시 이전 주문 시 당일 발송",
    },
    notice: {
      returns: [
        "단순변심/착오구매로 인한 교환·반품은 어려워요.",
        "상품 불량/오배송은 수령 후 48시간 이내 문의 부탁드려요.",
      ],
      care: [
        "물/땀에 장시간 노출 시 변색될 수 있어요.",
        "오염 시 부드러운 천으로 닦아주세요.",
      ],
    },
  },
  {
    id: "kyorang2",
    name: "다꾸 감성 스티커팩 (랜덤 30매)",
    price: 4900,
    images: [
      "https://picsum.photos/seed/kyorang2/900/900",
      "https://picsum.photos/seed/kyorang2b/900/900",
      "https://picsum.photos/seed/kyorang2c/900/900",
    ],
    tags: ["신상", "다꾸필수"],
    shortDesc: "30매 랜덤 구성! 다꾸/다이어리에 찰떡 ✨",
    desc:
      "랜덤 구성이라 매번 두근두근! 다꾸에 붙이기 좋은 사이즈로 골랐어요.\n\n- 구성: 스티커 30매(랜덤)\n- 재질: 무광/유광 혼합(랜덤)\n- 사이즈: 소형 위주",
    options: [{ name: "옵션", values: ["랜덤(기본)", "파스텔 위주", "키치 위주"] }],
    shipping: {
      fee: 3000,
      freeOver: 30000,
      eta: "평일 오후 2시 이전 주문 시 당일 발송",
    },
    notice: {
      returns: ["랜덤 구성 특성상 교환·반품은 어려워요."],
      care: ["직사광선을 피해 보관해 주세요."],
    },
  },
  {
    id: "kyorang3",
    name: "메모지 세트 (A7, 4종)",
    price: 3900,
    images: [
      "https://picsum.photos/seed/kyorang3/900/900",
      "https://picsum.photos/seed/kyorang3b/900/900",
    ],
    tags: ["베스트", "사무실픽"],
    shortDesc: "작고 귀여운 A7 메모지 4종 세트!",
    desc:
      "업무/공부/메모 어디든 쓰기 좋은 A7 사이즈. 책상 위 감성도 같이 챙겨요.\n\n- 구성: 4종(각 30매)\n- 사이즈: A7\n- 재질: 미색 용지",
    options: [{ name: "세트", values: ["핑크 톤", "베이지 톤"] }],
    shipping: {
      fee: 3000,
      freeOver: 30000,
      eta: "평일 오후 2시 이전 주문 시 당일 발송",
    },
    notice: {
      returns: ["종이 제품은 미세한 인쇄 차이가 있을 수 있어요."],
      care: ["습기가 많은 곳은 피해주세요."],
    },
  },
];

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function formatWon(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}
