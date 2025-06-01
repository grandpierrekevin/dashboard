export type Integration = {
  name: string;
  active: boolean;
  url: string;
  token: string;
  tested?: boolean;
  success?: boolean;
}; 