import { Assessment_cards } from '../models/assessments';

export interface CartItem {
  item: Assessment_cards;
  quantity: number;
}

export interface PurchaseItem {
  assessmentId: string;
  quantity: number;
}

export interface Purchase {
  id: string;
  userId: string;
  items: PurchaseItem[];
}
