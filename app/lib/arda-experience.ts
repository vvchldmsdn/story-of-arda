export type ArdaEraMap = {
  map: string;
  era: string;
  title: string;
  period: string;
  description: string;
  focus: string[];
};

export type JourneyStep = {
  label: string;
  koLabel: string;
  map: string;
  coords: [number, number];
  summary: string;
};

export type ArdaJourney = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  steps: JourneyStep[];
};

export type RelationNode = {
  name: string;
  role: string;
  href?: string;
};

export type RelationLink = {
  from: string;
  to: string;
  label: string;
};

export type RelationshipProfile = {
  id: string;
  title: string;
  center: string;
  subtitle: string;
  summary: string;
  nodes: RelationNode[];
  links: RelationLink[];
};

export const ardaEraMaps: ArdaEraMap[] = [
  {
    map: "Middle Earth",
    era: "제3시대",
    title: "가운데땅 말기의 전쟁과 왕국",
    period: "반지전쟁 전후",
    description:
      "곤도르, 로한, 모르도르, 리븐델, 로스로리엔을 잇는 반지전쟁의 무대입니다. 영화 팬이 가장 빠르게 몰입할 수 있는 기본 지도입니다.",
    focus: ["반지원정대", "곤도르와 로한", "사우론의 귀환"],
  },
  {
    map: "Beleriand",
    era: "제1시대",
    title: "벨레리안드의 비극과 영웅담",
    period: "실마릴 전쟁",
    description:
      "놀도르의 귀환, 베렌과 루시엔, 투린의 비극, 곤돌린의 몰락처럼 실마릴리온의 거대한 서사가 겹쳐지는 지도입니다.",
    focus: ["실마릴", "놀도르", "모르고스와 앙반드"],
  },
  {
    map: "Numenor",
    era: "제2시대",
    title: "누메노르의 영광과 몰락",
    period: "왕들의 시대",
    description:
      "인간 왕국의 절정과 오만, 사우론의 간계, 몰락 이후 곤도르와 아르노르로 이어지는 계보를 읽는 지도입니다.",
    focus: ["엘로스의 혈통", "아르파라존", "충실파와 왕의 사람들"],
  },
];

export const ardaJourneys: ArdaJourney[] = [
  {
    slug: "fellowship-road",
    title: "반지원정대의 길",
    subtitle: "리븐델에서 모르도르까지",
    description:
      "영화와 원작 독자가 가장 쉽게 따라올 수 있는 대표 루트입니다. 장소를 누르면 지도가 해당 지점으로 이동합니다.",
    steps: [
      {
        label: "Rivendell",
        koLabel: "리븐델",
        map: "Middle Earth",
        coords: [1848.8328, 746.6704],
        summary: "원정대가 결성되고 반지의 운명이 결정된 피난처입니다.",
      },
      {
        label: "Misty Mountains",
        koLabel: "안개 산맥",
        map: "Middle Earth",
        coords: [1936.3607, 897.4971],
        summary: "카라드라스와 모리아의 선택이 갈라지는 험한 장벽입니다.",
      },
      {
        label: "Lothlorien",
        koLabel: "로스로리엔",
        map: "Middle Earth",
        coords: [1987.927, 1189.6115],
        summary: "갈라드리엘의 숲에서 원정대는 상실 이후 다시 방향을 잡습니다.",
      },
      {
        label: "Anduin",
        koLabel: "안두인",
        map: "Middle Earth",
        coords: [2149.9587, 1286.9312],
        summary: "원정대가 흩어지고 각자의 전쟁으로 들어가는 강길입니다.",
      },
      {
        label: "Minas Tirith",
        koLabel: "미나스 티리스",
        map: "Middle Earth",
        coords: [2450.0072, 1962.575],
        summary: "서쪽 인간 왕국의 마지막 방어선입니다.",
      },
      {
        label: "Mordor",
        koLabel: "모르도르",
        map: "Middle Earth",
        coords: [3083.7443, 2053.4878],
        summary: "반지의 여정이 끝나는 적의 땅입니다.",
      },
    ],
  },
  {
    slug: "rohan-gondor-war",
    title: "로한과 곤도르의 전쟁선",
    subtitle: "헬름 협곡에서 펠렌노르까지",
    description:
      "두 인간 왕국이 어떻게 따로 버티다가 하나의 전선으로 합쳐지는지 따라가는 전쟁 루트입니다.",
    steps: [
      {
        label: "Isengard",
        koLabel: "아이센가드",
        map: "Middle Earth",
        coords: [1688.3238, 1520.817],
        summary: "사루만의 배신이 로한 전쟁의 불씨가 됩니다.",
      },
      {
        label: "Helm's Deep",
        koLabel: "헬름 협곡",
        map: "Middle Earth",
        coords: [1785.9546, 1690.0562],
        summary: "로한이 무너지지 않았다는 사실을 증명한 요새입니다.",
      },
      {
        label: "Edoras",
        koLabel: "에도라스",
        map: "Middle Earth",
        coords: [1878.2828, 1732.935],
        summary: "세오덴의 귀환과 기마대의 결단이 시작되는 왕도입니다.",
      },
      {
        label: "Minas Tirith",
        koLabel: "미나스 티리스",
        map: "Middle Earth",
        coords: [2450.0072, 1962.575],
        summary: "로한의 기마대가 곤도르의 절망을 깨는 장소입니다.",
      },
      {
        label: "Black Gate",
        koLabel: "검은 문",
        map: "Middle Earth",
        coords: [2601.5, 1712.5789],
        summary: "서쪽의 병력이 마지막 미끼가 되어 시간을 법니다.",
      },
    ],
  },
  {
    slug: "erebor-road",
    title: "외로운 산으로 가는 길",
    subtitle: "호빗의 모험 루트",
    description:
      "빌보의 여정을 따라 리븐델, 안개 산맥, 어둠숲, 에레보르로 이어지는 모험선을 읽습니다.",
    steps: [
      {
        label: "Rivendell",
        koLabel: "리븐델",
        map: "Middle Earth",
        coords: [1848.8328, 746.6704],
        summary: "뜻밖의 모험이 고대의 지식과 만나는 쉼터입니다.",
      },
      {
        label: "Misty Mountains",
        koLabel: "안개 산맥",
        map: "Middle Earth",
        coords: [1936.3607, 897.4971],
        summary: "골룸과 반지가 이야기의 깊은 축으로 들어오는 산맥입니다.",
      },
      {
        label: "Mirkwood",
        koLabel: "어둠 숲",
        map: "Middle Earth",
        coords: [2601.291, 952.8692],
        summary: "모험이 동화적 분위기에서 어둡고 위험한 숲길로 바뀝니다.",
      },
      {
        label: "Lonely Mountain",
        koLabel: "외로운 산",
        map: "Middle Earth",
        coords: [2550.238, 473.4328],
        summary: "스마우그와 소린의 왕국, 그리고 다섯 군대의 전장이 겹칩니다.",
      },
    ],
  },
];

const defaultRelationshipProfile: RelationshipProfile = {
  id: "arda-conflict-web",
  title: "아르다 핵심 관계도",
  center: "선택한 기록",
  subtitle: "인물, 왕국, 사건을 함께 읽기",
  summary:
    "이 기록을 하나의 문서로만 보지 않고 주변 인물과 세력, 사건의 연결 속에서 읽도록 설계한 관계도입니다.",
  nodes: [
    { name: "인물", role: "누가 움직였는가" },
    { name: "장소", role: "어디에서 갈라졌는가" },
    { name: "사건", role: "무엇이 세계를 바꿨는가" },
    { name: "세력", role: "누가 같은 편이었는가" },
  ],
  links: [
    { from: "선택한 기록", to: "인물", label: "등장" },
    { from: "선택한 기록", to: "장소", label: "무대" },
    { from: "선택한 기록", to: "사건", label: "전환점" },
    { from: "선택한 기록", to: "세력", label: "소속" },
  ],
};

export const relationshipProfiles: RelationshipProfile[] = [
  {
    id: "fellowship",
    title: "반지원정대 관계도",
    center: "Frodo Baggins",
    subtitle: "작은 운반자가 세계의 전선을 묶는 방식",
    summary:
      "프로도는 전사가 아니라 연결점입니다. 간달프, 샘, 아라고른, 골룸, 사우론을 함께 보면 반지전쟁의 감정선과 전략선이 동시에 보입니다.",
    nodes: [
      { name: "Gandalf", role: "인도자", href: "gandalf" },
      { name: "Samwise", role: "동행과 버팀목" },
      { name: "Aragorn", role: "원정대의 검", href: "aragorn-ii" },
      { name: "Gollum", role: "거울과 위험" },
      { name: "Sauron", role: "반지의 주인", href: "sauron" },
    ],
    links: [
      { from: "Frodo Baggins", to: "Gandalf", label: "임무를 받음" },
      { from: "Frodo Baggins", to: "Samwise", label: "끝까지 동행" },
      { from: "Frodo Baggins", to: "Aragorn", label: "보호와 분기" },
      { from: "Frodo Baggins", to: "Gollum", label: "유혹의 거울" },
      { from: "Frodo Baggins", to: "Sauron", label: "시선의 추적" },
    ],
  },
  {
    id: "aragorn",
    title: "아라고른 왕통 관계도",
    center: "Aragorn II",
    subtitle: "방랑자에서 왕으로 이어지는 혈통과 선택",
    summary:
      "아라고른은 단순한 영웅보다 왕통, 엘프와 인간의 결합, 곤도르의 회복을 한 몸에 묶는 인물입니다.",
    nodes: [
      { name: "Elendil", role: "누메노르의 계승", href: "elendil" },
      { name: "Isildur", role: "반지의 그림자", href: "isildur" },
      { name: "Arwen", role: "엘프와 인간의 결합", href: "arwen-undomiel" },
      { name: "Gondor", role: "왕의 귀환", href: "gondor" },
      { name: "Sauron", role: "왕권의 적", href: "sauron" },
    ],
    links: [
      { from: "Aragorn II", to: "Elendil", label: "혈통" },
      { from: "Aragorn II", to: "Isildur", label: "상속된 부담" },
      { from: "Aragorn II", to: "Arwen", label: "선택" },
      { from: "Aragorn II", to: "Gondor", label: "귀환" },
      { from: "Aragorn II", to: "Sauron", label: "대항" },
    ],
  },
  {
    id: "sauron",
    title: "사우론 권력 관계도",
    center: "Sauron",
    subtitle: "반지, 모르도르, 인간 왕국을 압박하는 중심",
    summary:
      "사우론은 한 인물이라기보다 권력의 네트워크입니다. 반지, 모르도르, 곤도르, 누메노르의 몰락을 함께 봐야 위협의 크기가 드러납니다.",
    nodes: [
      { name: "Mordor", role: "거점", href: "mordor" },
      { name: "The One Ring", role: "지배의 장치" },
      { name: "Numenor", role: "오만을 이용한 몰락", href: "numenor" },
      { name: "Gondor", role: "서쪽의 방어선", href: "gondor" },
      { name: "Witch-king", role: "대리 권력", href: "witch-king-of-angmar" },
    ],
    links: [
      { from: "Sauron", to: "Mordor", label: "요새화" },
      { from: "Sauron", to: "The One Ring", label: "권력 집중" },
      { from: "Sauron", to: "Numenor", label: "타락 유도" },
      { from: "Sauron", to: "Gondor", label: "공성" },
      { from: "Sauron", to: "Witch-king", label: "지휘" },
    ],
  },
  {
    id: "gondor-rohan",
    title: "곤도르와 로한 동맹 관계도",
    center: "Gondor",
    subtitle: "서쪽 인간 왕국의 마지막 방어선",
    summary:
      "곤도르는 성벽이고 로한은 기동력입니다. 두 왕국을 함께 보면 펠렌노르 전투가 왜 감정적으로 강한 장면인지 선명해집니다.",
    nodes: [
      { name: "Rohan", role: "맹약의 기마대", href: "rohan" },
      { name: "Minas Tirith", role: "수도와 방어선", href: "minas-tirith" },
      { name: "Osgiliath", role: "무너진 관문", href: "osgiliath" },
      { name: "Aragorn II", role: "왕의 귀환", href: "aragorn-ii" },
      { name: "Sauron", role: "동쪽의 압박", href: "sauron" },
    ],
    links: [
      { from: "Gondor", to: "Rohan", label: "원군" },
      { from: "Gondor", to: "Minas Tirith", label: "심장부" },
      { from: "Gondor", to: "Osgiliath", label: "전초전" },
      { from: "Gondor", to: "Aragorn II", label: "왕권 회복" },
      { from: "Gondor", to: "Sauron", label: "최전선" },
    ],
  },
];

export function getEraMap(map: string) {
  return ardaEraMaps.find((item) => item.map === map) || ardaEraMaps[0];
}

export function getJourneysForMap(map: string) {
  const filtered = ardaJourneys.filter((journey) =>
    journey.steps.some((step) => step.map === map),
  );

  return filtered.length > 0 ? filtered : ardaJourneys;
}

export function getJourneyBySlug(slug: string | null) {
  return ardaJourneys.find((journey) => journey.slug === slug) || ardaJourneys[0];
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

export function getRelationshipProfile(subject?: string, displayName?: string): RelationshipProfile {
  const key = normalize(`${subject || ""} ${displayName || ""}`);

  if (key.includes("aragorn") || key.includes("아라고른")) {
    return relationshipProfiles.find((profile) => profile.id === "aragorn")!;
  }

  if (
    key.includes("frodo") ||
    key.includes("sam") ||
    key.includes("gandalf") ||
    key.includes("gollum") ||
    key.includes("프로도") ||
    key.includes("간달프")
  ) {
    return relationshipProfiles.find((profile) => profile.id === "fellowship")!;
  }

  if (key.includes("sauron") || key.includes("mordor") || key.includes("사우론") || key.includes("모르도르")) {
    return relationshipProfiles.find((profile) => profile.id === "sauron")!;
  }

  if (
    key.includes("gondor") ||
    key.includes("rohan") ||
    key.includes("minastirith") ||
    key.includes("곤도르") ||
    key.includes("로한") ||
    key.includes("미나스")
  ) {
    return relationshipProfiles.find((profile) => profile.id === "gondor-rohan")!;
  }

  return {
    ...defaultRelationshipProfile,
    center: displayName || subject || defaultRelationshipProfile.center,
  };
}
