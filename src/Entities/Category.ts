import { v4 } from "uuid";
export class Category {
  id: string;
  precedence: number;
  name: string;
  words: string[];
  constructor(name: string, words: string[] = []) {
    this.id = v4();
    this.precedence = 0;
    this.words = words;
    this.name = name;
  }
}
