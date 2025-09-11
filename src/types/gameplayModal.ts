export interface GameplaySubTopic {
  title: string;
  description: string;
}

export interface GameplayTopic {
  title: string;
  description: string;
  subTopics: GameplaySubTopic[];
  emoji?: string
}

export interface GameplayModalData {
  title: string;
  subTitle: string;
  description: string;
  subTopics: GameplayTopic[];
}
