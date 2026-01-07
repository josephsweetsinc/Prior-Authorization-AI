export interface IUpdateOrganizationPayload {
  provider_type: string;
  professional_id: string;
  medic_name: string;
}

export interface IUpdateAccountPayload {
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  place_of_work: string;
}
