export interface TopicObject {
  topicId: string;
  topicName: string;
  recommended: boolean;
}

export interface TopicResponse {
  recommendedList: Array<TopicObject>;
  normalList: Array<TopicObject>;
}