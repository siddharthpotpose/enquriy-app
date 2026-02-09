export interface Environment {
  production: boolean;
  apiUrl: string;
  apiLoginUrl: string;
}

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.freeprojectapi.com/api/Enquiry/',
  apiLoginUrl: 'https://api.freeprojectapi.com/api/UserApp/'
};
