export type MapType = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type RegionNameType = {
  name: string;
  brief_description: string;
};

export type RegionDetailType = {
  description: string;
};

export type CardSummaryType = {
  total: number;
};

export type CardPropType = {
  type: string;
  num: number;
  regionName: string;
  randomName: string;
}