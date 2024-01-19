const regions = [
  { value: 'Minas Tirith', coords: [1696.3132, 1183.6707] },
  { value: 'Edoras', coords: [1411.6403, 1038.0861] },
  { value: `Helm's Deep`, coords: [1354.0849, 1003.2273] },
  { value: 'Osgiliath', coords: [1739.1387, 1171.8463] },
  { value: 'Angmar', coords: [1294.9082, 239.5778] },
  { value: 'Mount Gundabad', coords: [1401.102, 242.0098] },
  { value: 'Tolfalas', coords: [1449.4142, 1415.677] },
  { value: 'Dol Guldur', coords: [1621.6751, 690.1289] },
  { value: 'Hills of Evendim', coords: [817.1153, 294.9281] },
  { value: 'Weathertop', coords: [1142.0203, 457.9452] },
  { value: 'Lindon', coords: [-1, -1] },
  { value: 'Rivendell', coords: [1398.1824, 448.2172] },
  { value: 'Erebor', coords: [1784.0469, 313.6463] },
  { value: 'Shire', coords: [-1, -1] },
  { value: 'Numenor', coords: [-1, -1] },
  { value: 'Havens of Sirion', coords: [-1, -1] },
  { value: 'Rohan', coords: [1433.8505, 954.0742] },
  { value: 'Lothlorien', coords: [-1, -1] },
  { value: 'Valinor', coords: [-1, -1] },
  { value: 'The Woodland Realm', coords: [-1, -1] },
  { value: 'Gondolin', coords: [-1, -1] },
  { value: 'Hobbiton', coords: [876.1305, 480.644] },
];

export const sortedRegions = regions.sort((a, b) => a.value.localeCompare(b.value));