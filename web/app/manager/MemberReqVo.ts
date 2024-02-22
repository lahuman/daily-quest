export interface MemberReqVo {
    seq: number;
    userSeq: number;
    managerSeq?: number;
    managerName?: string;
    email: string;
    userEmail: string;
    acceptYn: string;
  }
  