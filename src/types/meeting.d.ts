export interface IMeeting {
  meetingID: string;
  expertID: string;
  meetingDate: Date;
  comment?: string;
  rate?: number;
  price: number;
  topics?: string[];
}

export interface IcreateCommentQueries {
  comment: string;
  rate: number;
}