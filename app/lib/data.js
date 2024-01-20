// const { v4: uuidv4 } = require('uuid');

/* 아라곤의 이름, 출생 날짜, 죽은 날짜, 별명, 출생지 영어로 적어줘

============================

아라곤에 대한 brief description 세 문장으로 영어로 작성해줘

=====================================

Thranduil에 대한 biography, 인물 관계 및 역할, 능력 및 특징 세 개로 나눠서 영어로 작성해줘.
분량은 biography는 최소 여섯 문단, 인물 관계 및 역할은 최소 3문단, 능력 및 특징은 최소 3문단으로 해줘.
최소 문단 수를 꼭!채워줘. 그리고 중복되는 정보가 없게 작성해줘 */

/* 중개 테이블 삽입 정보 (엑셀 row에서 3 뺀 값)
race_language -> 완
line -> Lake Town까지 했음
region_line -> 엑셀 line 기준 47
person_region -> 엑셀 person 기준 27
*/

const regions = [ 
  // Moria
  // { id: uuidv4(), name: '',
  // brief_description: ``,
  // history: ``,
  // geography: ``,
  // role_in_story: ``,
  // depiction_in_media: ``
  // },
  // { id: uuidv4(), name: '',
  // brief_description: ``,
  // history: ``,
  // geography: ``,
  // role_in_story: ``,
  // depiction_in_media: ``
  // },
  // { id: uuidv4(), name: '',
  // brief_description: ``,
  // history: ``,
  // geography: ``,
  // role_in_story: ``,
  // depiction_in_media: ``
  // },
];

const lines = [
  { start_point: [1767.0878, 349.4415], end_point: [1764.6816, 364.6809] },
];

const regionLines = [
  { region_id: 28, line_id: 35 },
  { region_id: 28, line_id: 36 },
  { region_id: 29, line_id: 37 },
  { region_id: 29, line_id: 38 },
  { region_id: 30, line_id: 39 },
  { region_id: 31, line_id: 40 },
  { region_id: 31, line_id: 41 },
  { region_id: 31, line_id: 42 },
  { region_id: 31, line_id: 43 },
  { region_id: 27, line_id: 44 },
];

const persons = [
  // { id: uuidv4(), name: 'Witch-king of Angmar', birth_date: 'Before Second Age 2251', death_date: 'March 15, Third Age 3019', nickname: 'The Witch-king, Lord of the Nazgûl, Black Captain', gender: 0, race_id: races[0].id, home: regions[4].id,
  // brief_description: `The Witch-king of Angmar is a central antagonist in J.R.R. Tolkien's "The Lord of the Rings". As the leader of the Nazgûl or Ringwraiths, he is Sauron's most feared servant, cloaked in shadow and terror. Originally a human king seduced by one of the nine Rings of Power given to men, he became an undying specter, leading the forces of Mordor in their war against the free peoples of Middle-earth.`,
  // history: ``,
  // crrs: ``,
  // abilities_characteristics: ``
  // },
  // { id: uuidv4(), name: '', birth_date: '', death_date: '', nickname: '', gender: '', race_id: '', home: '',
  // brief_description: ``,
  // history: ``,
  // crrs: ``,
  // abilities_characteristics: ``
  // },
  // { id: uuidv4(), name: '', birth_date: '', death_date: '', nickname: '', gender: '', race_id: '', home: '',
  // brief_description: ``,
  // history: ``,
  // crrs: ``,
  // abilities_characteristics: ``
  // },
  // { id: uuidv4(), name: '', birth_date: '', death_date: '', nickname: '', gender: '', race_id: '', home: '',
  // brief_description: ``,
  // history: ``,
  // crrs: ``,
  // abilities_characteristics: ``
  // },
];

const personRegions = [
  
];

const quotes = [
  
];

module.exports = {
  regions,
  lines,
  regionLines,
  persons,
  personRegions,
  quotes,
};