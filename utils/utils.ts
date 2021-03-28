export default class Utils {
  static textWords(text: string): Array<string> {
    if (!text) {
      return [];
    }
  
    return text.replaceAll('\n', ' <br> ').split(' ').filter(word => word);
  }
}