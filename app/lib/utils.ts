export const convertString = (str: string) => {
  const lowerCaseWords = ["of", "in", "the", "a", "an"]; // 전치사 및 소문자로 유지할 단어 목록
  return str.split('-')
    .map(word => {
      // 단어가 전치사 리스트에 있으면 소문자로 유지, 아니면 첫 글자를 대문자로 변환
      return lowerCaseWords.includes(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};