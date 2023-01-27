export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class TopPageModel {
  firstLevelCategory: TopLevelCategory;
  secondCategory: string;
  title: string;
  category: string;
  hh?: {
    count: number;
    juniorSalary: number;
    middleSalary: number;
    SeniorSalary: number;
  };
  advantages: {
    title: string;
    description: string;
  }[];
  seoText: string;
  tags: string[];
  tagsTitle?: string;
}
