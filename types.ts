export interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string;
  iban: string;
  cvv: string;
  expiryDate: string;
  bankColor?: string;
  bankNameEn?: string;
  customColor?: string;
  customTitle?: string;
}