export interface MemberVo {
  seq: number;
  userSeq: number;
  managerSeq?: number;
  name: string;
  color: string;
  totalPoint: number;
  useYn: string;
  showColor?: boolean;
  user?: {
    email: string;
    seq: number;
  };
}
